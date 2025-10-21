import React from 'react';
import CardComponent from './Card';
import { Card as CardType, DraggedItem } from '../types';

interface DragLayerProps {
    draggedItem: DraggedItem | null;
    tableau: CardType[][];
    cursorPosition: { x: number; y: number };
}

const DragLayer: React.FC<DragLayerProps> = ({ draggedItem, tableau, cursorPosition }) => {
    if (!draggedItem) {
        return null;
    }

    const { fromPile, fromIndex, cardIndex, card } = draggedItem;
    let cardsToRender: CardType[] = [card];

    if (fromPile === 'tableau') {
        cardsToRender = tableau[fromIndex].slice(cardIndex);
    }
    
    // Offset to make the cursor appear in the middle of the card
    const style: React.CSSProperties = {
        position: 'fixed',
        pointerEvents: 'none',
        left: 0,
        top: 0,
        transform: `translate(${cursorPosition.x - 48}px, ${cursorPosition.y - 72}px)`, // Half of card width/height
        zIndex: 1000,
    };

    return (
        <div style={style}>
            {cardsToRender.map((c, i) => (
                <CardComponent
                    key={`${c.suit}-${c.rank}`}
                    card={c}
                    pileType="tableau" // placeholder
                    pileIndex={0} // placeholder
                    cardIndex={0} // placeholder
                    onDragStart={() => {}}
                    onDragEnd={() => {}}
                    // FIX: Add missing onDoubleClick prop to satisfy CardProps interface.
                    onDoubleClick={() => {}}
                    isDraggable={false}
                    style={{
                        position: 'absolute',
                        top: `${i * 25}px`,
                        left: 0,
                    }}
                />
            ))}
        </div>
    );
};

export default DragLayer;
