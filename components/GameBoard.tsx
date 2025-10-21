import React from 'react';
import CardComponent from './Card';
import { Card, DraggedItem, PileType } from '../types';

interface GameBoardProps {
    stock: Card[];
    waste: Card[];
    foundations: Card[][];
    tableau: Card[][];
    onStockClick: () => void;
    onDragStart: (item: DraggedItem) => void;
    onDrop: (targetPile: PileType, targetIndex: number) => void;
    onDragEnd: () => void;
    onCardDoubleClick: (card: Card, pileType: PileType, pileIndex: number, cardIndex: number) => void;
}

const Pile: React.FC<{
    children?: React.ReactNode;
    onDrop: () => void;
    className?: string;
}> = ({ children, onDrop, className }) => {
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    return (
        <div
            onDragOver={handleDragOver}
            onDrop={onDrop}
            className={`w-24 h-36 bg-black/20 rounded-lg border border-white/40 relative ${className || ''}`}
        >
            {children}
        </div>
    );
};

const GameBoard: React.FC<GameBoardProps> = ({ stock, waste, foundations, tableau, onStockClick, onDragStart, onDrop, onDragEnd, onCardDoubleClick }) => {
    return (
        <div className="w-full max-w-5xl mx-auto p-4 space-y-6">
            {/* Top Row: Stock, Waste, Foundations */}
            <div className="flex justify-between items-start">
                <div className="flex space-x-4">
                    {/* Stock */}
                    <Pile onDrop={() => {}} className="cursor-pointer" >
                        {stock.length > 0 && (
                            <div onClick={onStockClick}>
                                <CardComponent 
                                    card={stock[stock.length - 1]} 
                                    pileType="stock"
                                    pileIndex={0}
                                    cardIndex={stock.length - 1}
                                    onDragStart={()=>{}}
                                    onDragEnd={()=>{}}
                                    onDoubleClick={()=>{}}
                                    style={{ left: 0, top: 0 }}
                                />
                            </div>
                        )}
                         {stock.length === 0 && (
                            <div 
                                onClick={onStockClick}
                                className="w-full h-full flex items-center justify-center text-5xl text-white/70"
                            >
                                ⟳
                            </div>
                         )}
                    </Pile>

                    {/* Waste */}
                    <Pile onDrop={() => onDrop('waste', 0)}>
                        {waste.length > 0 && (
                             <CardComponent 
                                card={waste[waste.length - 1]} 
                                pileType="waste"
                                pileIndex={0}
                                cardIndex={waste.length - 1}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                                onDoubleClick={onCardDoubleClick}
                                style={{ left: 0, top: 0 }}
                            />
                        )}
                    </Pile>
                </div>
                
                {/* Foundations */}
                <div className="flex space-x-4">
                    {foundations.map((pile, i) => (
                        <Pile key={i} onDrop={() => onDrop('foundation', i)}>
                            {pile.length > 0 && (
                                <CardComponent 
                                    card={pile[pile.length-1]} 
                                    pileType="foundation"
                                    pileIndex={i}
                                    cardIndex={pile.length-1}
                                    onDragStart={onDragStart}
                                    onDragEnd={onDragEnd}
                                    onDoubleClick={onCardDoubleClick}
                                    style={{ left: 0, top: 0 }}
                                />
                            )}
                        </Pile>
                    ))}
                </div>
            </div>

            {/* Tableau */}
            <div className="flex justify-between items-start">
                {tableau.map((pile, i) => (
                    <Pile key={i} onDrop={() => onDrop('tableau', i)}>
                        {pile.map((card, j) => (
                             <CardComponent
                                key={`${card.suit}-${card.rank}`}
                                card={card}
                                pileType="tableau"
                                pileIndex={i}
                                cardIndex={j}
                                onDragStart={onDragStart}
                                onDragEnd={onDragEnd}
                                onDoubleClick={onCardDoubleClick}
                                style={{ top: `${j * 25}px`, left: 0 }}
                            />
                        ))}
                    </Pile>
                ))}
            </div>
        </div>
    );
};

export default GameBoard;