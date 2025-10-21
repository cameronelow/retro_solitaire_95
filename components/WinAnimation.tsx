import React, { useState, useEffect, useRef } from 'react';
import { SUITS, RANKS, SUIT_COLORS } from '../constants';
import { Card } from '../types';

interface WinAnimationProps {
    onComplete: () => void;
}

interface BouncingCard extends Card {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
}

const WinAnimation: React.FC<WinAnimationProps> = ({ onComplete }) => {
    const [cards, setCards] = useState<BouncingCard[]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const createDeck: () => Card[] = () => {
            const fullDeck: Card[] = [];
            SUITS.forEach(suit => {
                RANKS.forEach(rank => {
                    fullDeck.push({ suit, rank, faceUp: true });
                });
            });
            return fullDeck;
        };

        const deck = createDeck();
        const initialCards = deck.map((card, index) => ({
            ...card,
            id: index,
            x: Math.random() * (window.innerWidth - 100),
            y: -150 - Math.random() * 500,
            vx: Math.random() * 4 - 2,
            vy: Math.random() * 5 + 2,
        }));
        setCards(initialCards);

        const timeoutId = setTimeout(onComplete, 12000);

        return () => {
            clearTimeout(timeoutId);
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const animate = () => {
            if (!containerRef.current) return;
            const { width, height } = containerRef.current.getBoundingClientRect();
            
            setCards(prevCards => 
                prevCards.map(card => {
                    let { x, y, vx, vy } = card;

                    vy += 0.1;
                    x += vx;
                    y += vy;

                    if (x <= 0 || x >= width - 96) {
                        vx *= -0.9;
                        x = Math.max(0, Math.min(x, width - 96));
                    }
                    if (y >= height - 144) {
                        vy *= -0.85;
                        y = height - 144;
                        vx *= 0.98;
                    }
                    if (y <= 0) {
                        vy *= -0.85;
                        y = 0;
                    }

                    return { ...card, x, y, vx, vy };
                })
            );

            animationFrameId.current = requestAnimationFrame(animate);
        };

        animationFrameId.current = requestAnimationFrame(animate);
        
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, []);

    return (
        <div ref={containerRef} className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex items-center justify-center">
                 <h1 className="text-8xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Arial, sans-serif' }}>YOU WIN!</h1>
            </div>
            {cards.map(card => {
                const suitColor = SUIT_COLORS[card.suit];
                return (
                    <div
                        key={card.id}
                        className="w-24 h-36 bg-white rounded-lg p-1 flex flex-col justify-between shadow-lg border-black/50 border absolute"
                        style={{
                            transform: `translate(${card.x}px, ${card.y}px)`,
                            willChange: 'transform'
                        }}
                    >
                        <div className={`text-left ${suitColor}`}>
                            <div className="font-bold text-lg leading-none">{card.rank}</div>
                        </div>
                         <div className={`text-right transform rotate-180 ${suitColor}`}>
                            <div className="font-bold text-lg leading-none">{card.rank}</div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default WinAnimation;