export type Suit = 'HEARTS' | 'DIAMONDS' | 'CLUBS' | 'SPADES';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
    suit: Suit;
    rank: Rank;
    faceUp: boolean;
}

export type PileType = 'stock' | 'waste' | 'foundation' | 'tableau';

export interface DraggedItem {
    card: Card;
    fromPile: PileType;
    fromIndex: number; // pile index
    cardIndex: number; // index of card within the pile
}