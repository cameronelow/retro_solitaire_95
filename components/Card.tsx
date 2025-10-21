import React from 'react';
import { Card as CardType, DraggedItem, PileType } from '../types';
import { SUIT_SYMBOLS, SUIT_COLORS } from '../constants';

interface CardProps {
    card: CardType;
    pileType: PileType;
    pileIndex: number;
    cardIndex: number;
    onDragStart: (item: DraggedItem) => void;
    onDragEnd: () => void;
    onDoubleClick: (card: CardType, pileType: PileType, pileIndex: number, cardIndex: number) => void;
    isDraggable?: boolean;
    style?: React.CSSProperties;
}

const CardBack = () => (
    <div className="w-full h-full bg-blue-600 rounded-md shadow-inner border border-blue-800" />
);


const Card: React.FC<CardProps> = ({ card, pileType, pileIndex, cardIndex, onDragStart, onDragEnd, onDoubleClick, isDraggable = true, style }) => {
    const suitColor = SUIT_COLORS[card.suit];

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
        if (!card.faceUp || !isDraggable) {
            e.preventDefault();
            return;
        }
        onDragStart({ card, fromPile: pileType, fromIndex: pileIndex, cardIndex });
        // Use a transparent image for drag ghost so we can use our custom drag layer
        const img = new Image();
        img.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
        e.dataTransfer.setDragImage(img, 0, 0);
    };

    if (!card.faceUp) {
        return (
            <div
                className="w-24 h-36 rounded-lg shadow-md absolute"
                style={style}
            >
                <CardBack />
            </div>
        );
    }

    return (
        <div
            draggable={isDraggable && card.faceUp}
            onDragStart={handleDragStart}
            onDragEnd={onDragEnd}
            onDoubleClick={() => onDoubleClick(card, pileType, pileIndex, cardIndex)}
            className="w-24 h-36 bg-white rounded-lg p-1 flex flex-col justify-between shadow-md cursor-grab active:cursor-grabbing absolute border-black/50 border"
            style={style}
        >
            <div className={`text-left ${suitColor}`}>
                <div className="font-bold text-lg leading-none">{card.rank}</div>
                <div className="text-lg leading-none">{SUIT_SYMBOLS[card.suit]}</div>
            </div>
            <div className={`text-center text-4xl ${suitColor}`}>
                {SUIT_SYMBOLS[card.suit]}
            </div>
            <div className={`text-right transform rotate-180 ${suitColor}`}>
                <div className="font-bold text-lg leading-none">{card.rank}</div>
                <div className="text-lg leading-none">{SUIT_SYMBOLS[card.suit]}</div>
            </div>
        </div>
    );
};

export default Card;