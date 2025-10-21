import React, { useState, useEffect, useCallback } from 'react';
import GameBoard from './components/GameBoard';
import WinAnimation from './components/WinAnimation';
import DragLayer from './components/DragLayer';
import { Card, DraggedItem, PileType } from './types';
import { SUITS, RANKS, RANK_VALUES } from './constants';

const App: React.FC = () => {
    const [gameState, setGameState] = useState<'playing' | 'won' | 'new'>('new');
    const [stock, setStock] = useState<Card[]>([]);
    const [waste, setWaste] = useState<Card[]>([]);
    const [foundations, setFoundations] = useState<Card[][]>([[], [], [], []]);
    const [tableau, setTableau] = useState<Card[][]>([[], [], [], [], [], [], []]);
    const [draggedItem, setDraggedItem] = useState<DraggedItem | null>(null);
    const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
    const [score, setScore] = useState<number>(0);

    const createDeck = (): Card[] => {
        const deck: Card[] = [];
        for (const suit of SUITS) {
            for (const rank of RANKS) {
                deck.push({ suit, rank, faceUp: false });
            }
        }
        return deck;
    };

    const shuffleDeck = (deck: Card[]): Card[] => {
        for (let i = deck.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [deck[i], deck[j]] = [deck[j], deck[i]];
        }
        return deck;
    };

    const startGame = useCallback(() => {
        const shuffledDeck = shuffleDeck(createDeck());
        
        const newTableau: Card[][] = Array.from({ length: 7 }, (_, i) => shuffledDeck.splice(0, i + 1));
        newTableau.forEach(pile => pile[pile.length - 1].faceUp = true);
        
        setTableau(newTableau);
        setStock(shuffledDeck);
        setWaste([]);
        setFoundations([[], [], [], []]);
        setScore(0);
        setGameState('playing');
    }, []);

    useEffect(() => {
        if (gameState === 'new') {
            startGame();
        }
    }, [gameState, startGame]);

    const checkWinCondition = useCallback(() => {
        const won = foundations.every(pile => pile.length === 13);
        if (won) {
            setGameState('won');
        }
    }, [foundations]);

    const handleStockClick = () => {
        if (stock.length > 0) {
            const newStock = [...stock];
            const cardToMove = newStock.pop()!;
            cardToMove.faceUp = true;
            setWaste(prevWaste => [...prevWaste, cardToMove]);
            setStock(newStock);
        } else if (waste.length > 0) {
            const newStock = [...waste].reverse().map(c => ({...c, faceUp: false}));
            setStock(newStock);
            setWaste([]);
        }
    };
    
    const handleDragStart = (item: DraggedItem) => {
        setDraggedItem(item);
    };

    const handleDrop = (targetPile: PileType, targetIndex: number) => {
        if (!draggedItem) return;

        const { card, fromPile, fromIndex, cardIndex } = draggedItem;
        let isValidMove = false;

        if (targetPile === 'foundation') {
            const cardsBeingMoved = fromPile === 'tableau' ? tableau[fromIndex].slice(cardIndex) : [card];
            if (cardsBeingMoved.length === 1) {
                const foundation = foundations[targetIndex];
                const topCard = foundation.length > 0 ? foundation[foundation.length - 1] : null;
                if (!topCard && card.rank === 'A') {
                    isValidMove = true;
                }
                else if (topCard && topCard.suit === card.suit && RANK_VALUES[card.rank] === RANK_VALUES[topCard.rank] + 1) {
                    isValidMove = true;
                }
            }
        }

        if (targetPile === 'tableau') {
            const targetTableauPile = tableau[targetIndex];
            const topCard = targetTableauPile.length > 0 ? targetTableauPile[targetTableauPile.length - 1] : null;
            if (!topCard && card.rank === 'K') {
                isValidMove = true;
            }
            else if (topCard && card.suit === topCard.suit && RANK_VALUES[card.rank] === RANK_VALUES[topCard.rank] - 1) {
                isValidMove = true;
            }
        }

        if (isValidMove) {
            const newTableau = tableau.map(pile => [...pile]);
            const newFoundations = foundations.map(pile => [...pile]);
            let newWaste = [...waste];
            let cardsToMove: Card[];

            if (fromPile === 'waste') {
                cardsToMove = [newWaste.pop()!];
            } else if (fromPile === 'foundation') {
                cardsToMove = [newFoundations[fromIndex].pop()!];
            } else {
                cardsToMove = newTableau[fromIndex].splice(cardIndex);
                const sourcePile = newTableau[fromIndex];
                if (sourcePile.length > 0 && !sourcePile[sourcePile.length - 1].faceUp) {
                    sourcePile[sourcePile.length - 1].faceUp = true;
                }
            }

            // Scoring logic
            if (targetPile === 'foundation') {
                setScore(prev => prev + 10);
            }

            if (targetPile === 'tableau') {
                newTableau[targetIndex].push(...cardsToMove);
            } else {
                newFoundations[targetIndex].push(...cardsToMove);
            }

            setTableau(newTableau);
            setFoundations(newFoundations);
            setWaste(newWaste);

            setTimeout(checkWinCondition, 0);
        }

        setDraggedItem(null);
    };

    const handleCardDoubleClick = (card: Card, fromPile: PileType, fromIndex: number, cardIndex: number) => {
        if (fromPile === 'tableau' && cardIndex !== tableau[fromIndex].length - 1) return;
        if (fromPile === 'waste' && cardIndex !== waste.length - 1) return;
        if (fromPile !== 'tableau' && fromPile !== 'waste') return;
    
        for (let i = 0; i < foundations.length; i++) {
            const foundation = foundations[i];
            const topCard = foundation.length > 0 ? foundation[foundation.length - 1] : null;
    
            let isValidMove = false;
            if (!topCard && card.rank === 'A') {
                isValidMove = true;
            } else if (topCard && topCard.suit === card.suit && RANK_VALUES[card.rank] === RANK_VALUES[topCard.rank] + 1) {
                isValidMove = true;
            }
    
            if (isValidMove) {
                const newFoundations = foundations.map(p => [...p]);
                newFoundations[i].push(card);
    
                if (fromPile === 'waste') {
                    const newWaste = [...waste];
                    newWaste.pop();
                    setWaste(newWaste);
                } else if (fromPile === 'tableau') {
                    const newTableau = tableau.map(p => [...p]);
                    newTableau[fromIndex].pop();
                    const sourcePile = newTableau[fromIndex];
                    if (sourcePile.length > 0 && !sourcePile[sourcePile.length - 1].faceUp) {
                        sourcePile[sourcePile.length - 1].faceUp = true;
                    }
                    setTableau(newTableau);
                }
                
                setFoundations(newFoundations);
                setScore(prev => prev + 10); // Score for moving to foundation
                setTimeout(checkWinCondition, 0);
                return;
            }
        }
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        if (draggedItem) {
            setCursorPosition({ x: e.clientX, y: e.clientY });
        }
    };

    return (
        <div 
            className="flex flex-col items-center justify-start min-h-screen select-none"
            onDragOver={handleDragOver}
        >
            {gameState === 'won' ? (
                <WinAnimation onComplete={() => setGameState('new')} />
            ) : (
                <>
                    <div className="w-full bg-gray-300 p-2 mb-4 flex justify-between items-center">
                        <div className="flex space-x-2">
                           <button 
                                onClick={() => setGameState('new')}
                                className="px-4 py-1 bg-gray-300 border-2 border-t-white border-l-white border-b-gray-500 border-r-gray-500 active:border-t-gray-500 active:border-l-gray-500 active:border-b-white active:border-r-white"
                            >
                                New Game
                            </button>
                        </div>
                         <div className="px-4 py-1 bg-gray-200 border-2 border-t-gray-500 border-l-gray-500 border-b-white border-r-white">
                            <span>Score: {score}</span>
                        </div>
                    </div>
                    <GameBoard
                        stock={stock}
                        waste={waste}
                        foundations={foundations}
                        tableau={tableau}
                        onStockClick={handleStockClick}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragEnd={handleDragEnd}
                        onCardDoubleClick={handleCardDoubleClick}
                    />
                    <DragLayer 
                        draggedItem={draggedItem}
                        tableau={tableau}
                        cursorPosition={cursorPosition}
                    />
                </>
            )}
        </div>
    );
};

export default App;