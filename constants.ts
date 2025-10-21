import { Suit, Rank } from './types';

export const SUITS: Suit[] = ['HEARTS', 'DIAMONDS', 'CLUBS', 'SPADES'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export const RANK_VALUES: { [key in Rank]: number } = {
    'A': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13
};

export const SUIT_SYMBOLS: { [key in Suit]: string } = {
    HEARTS: '♥',
    DIAMONDS: '♦',
    CLUBS: '♣',
    SPADES: '♠'
};

export const SUIT_COLORS: { [key in Suit]: string } = {
    HEARTS: 'text-red-600',
    DIAMONDS: 'text-red-600',
    CLUBS: 'text-black',
    SPADES: 'text-black'
};