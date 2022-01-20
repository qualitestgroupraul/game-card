import {useCallback, useEffect, useMemo, useReducer} from 'react';
import {Card} from '../types';
import {get, post} from '../api';

type CardGameState = {
    isGameInitialized: boolean,
    isLoadingGame: boolean,
    deckId: string | null,
    player1CardsCount: number,
    player2CardsCount: number,
    isLoadingNextRound: boolean,
    currentRoundCards: Card[] | null,
    currentRoundWinnerIndex: 0 | 1 | 'equal' | null,
    remainingCardsCount: number,
    gameWinnerIndex: number | null
};

type CardGameAction = {
    type: 'start-game'
} | {
    type: 'init-game',
    deckId: string,
    remainingCardsCount: number
} | {
    type: 'start-next-round'
} | {
    type: 'init-next-round',
    currentRoundCards: Card[],
    remainingCardsCount: number
};

const initialState: CardGameState = {
    isGameInitialized: false,
    isLoadingGame: false,
    deckId: null,
    player1CardsCount: 0,
    player2CardsCount: 0,
    isLoadingNextRound: false,
    currentRoundCards: null,
    currentRoundWinnerIndex: null,
    remainingCardsCount: 0,
    gameWinnerIndex: null
};

const specialCardValues = new Map([
    ['ACE', 15],
    ['KING', 14],
    ['QUEEN', 13],
    ['JACK', 12]
])

function reducer(state: CardGameState, action: CardGameAction) {
    switch (action.type) {
        case 'start-game': {
            return {
                ...initialState,
                isLoadingGame: true,
                gameWinnerIndex: null
            };
        }
        case 'init-game': {
            return {
                ...state,
                isGameInitialized: true,
                isLoadingGame: false,
                deckId: action.deckId,
                remainingCardsCount: action.remainingCardsCount
            };
        }
        case 'start-next-round': {
            return {
                ...state,
                isLoadingNextRound: true,
                currentRoundCards: null,
                currentRoundWinnerIndex: null
            }
        }
        case 'init-next-round': {
            const currentRoundWinnerIndex = getCurrentRoundWinnerIndex(action.currentRoundCards);
            const player1CardsCount = currentRoundWinnerIndex === 0
                ? state.player1CardsCount + 2
                : state.player1CardsCount;
            const player2CardsCount = currentRoundWinnerIndex === 1
                ? state.player2CardsCount + 2
                : state.player2CardsCount;

            return {
                ...state,
                isLoadingNextRound: false,
                currentRoundCards: action.currentRoundCards,
                currentRoundWinnerIndex,
                player1CardsCount,
                player2CardsCount,
                remainingCardsCount: action.remainingCardsCount,
                gameWinnerIndex: action.remainingCardsCount === 0 && currentRoundWinnerIndex !== 'equal'
                    ? player1CardsCount > player2CardsCount
                        ? 0
                        : 1
                    : null
            };
        }
        default: {
            return state;
        }
    }
}

const getCurrentRoundWinnerIndex = ([card1, card2]: Card[]): 0 | 1 | 'equal' => {
    const card1Value = getCardValue(card1);
    const card2Value = getCardValue(card2);

    return card1Value > card2Value
        ? 0
        : card1Value === card2Value
            ? 'equal'
            : 1;
};

const getCardValue = (card: Card) => {
    return specialCardValues.get(card.value) ?? Number(card.value);
};

export default function useCardGame() {
    const [cardGameState, dispatch] = useReducer(reducer, initialState);

    const startGame = useCallback(async () => {
        dispatch({type: 'start-game'});

        const {deck_id: deckId, remaining: remainingCardsCount} = await get('new/shuffle/');

        dispatch({type: 'init-game', deckId, remainingCardsCount});
    }, []);

    const startNextRound = useCallback(async () => {
        const wasPreviousRoundEqual = cardGameState.currentRoundWinnerIndex === 'equal';
        const {currentRoundCards: previousRoundCards} = cardGameState;

        dispatch({type: 'start-next-round'});

        if (wasPreviousRoundEqual) {
            await post(`${cardGameState.deckId}/return/?cards=${previousRoundCards!.map(card => card.code).join()}`);
            await post(`${cardGameState.deckId}/shuffle/?remaining=true`);
        }

        const {
            cards: currentRoundCards,
            remaining: remainingCardsCount
        } = await get(`${cardGameState.deckId}/draw/?count=2`);

        dispatch({type: 'init-next-round', currentRoundCards, remainingCardsCount});
    }, [cardGameState]);

    const cardGameModel = useMemo(() => ({
        ...cardGameState,
        startGame,
        startNextRound
    }), [
        cardGameState
    ]);

    useEffect(() => {
        startGame();
    }, []);

    return cardGameModel;
}