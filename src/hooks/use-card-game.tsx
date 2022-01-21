import {useCallback, useEffect, useMemo, useReducer} from 'react';
import {Card, Winner} from '../types';
import {get, post} from '../api';

type CardGameState = {
    isGameInitialized: boolean,
    isLoadingGame: boolean,
    deckId: string | null,
    player1CardsCount: number,
    player2CardsCount: number,
    isLoadingNextRound: boolean,
    currentRoundCards: Card[] | null,
    currentRoundWinner: Winner | null,
    remainingCardsCount: number,
    gameWinner: Winner | null,
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
    currentRoundWinner: null,
    remainingCardsCount: 0,
    gameWinner: null
};

const specialCardValues = new Map([
    ['ACE', 15],
    ['KING', 14],
    ['QUEEN', 13],
    ['JACK', 12]
])

function reducer(state: CardGameState, action: CardGameAction): CardGameState {
    switch (action.type) {
        case 'start-game': {
            return {
                ...initialState,
                isLoadingGame: true,
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
                currentRoundWinner: null
            }
        }
        case 'init-next-round': {
            const currentRoundWinner = getCurrentRoundWinner(action.currentRoundCards);
            const player1CardsCount = currentRoundWinner === 'player1'
                ? state.player1CardsCount + 2
                : state.player1CardsCount;
            const player2CardsCount = currentRoundWinner === 'player2'
                ? state.player2CardsCount + 2
                : state.player2CardsCount;

            return {
                ...state,
                isLoadingNextRound: false,
                currentRoundCards: action.currentRoundCards,
                currentRoundWinner,
                player1CardsCount,
                player2CardsCount,
                remainingCardsCount: action.remainingCardsCount,
                gameWinner: action.remainingCardsCount === 0
                    ? player1CardsCount > player2CardsCount
                        ? 'player1'
                        : player1CardsCount === player2CardsCount
                            ? 'equal'
                            : 'player2'
                    : null
            };
        }
        default: {
            return state;
        }
    }
}

const getCurrentRoundWinner = ([card1, card2]: Card[]): Winner => {
    const card1Value = getCardValue(card1);
    const card2Value = getCardValue(card2);

    return card1Value > card2Value
        ? 'player1'
        : card1Value === card2Value
            ? 'equal'
            : 'player2';
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
        const wasPreviousRoundEqual = cardGameState.currentRoundWinner === 'equal';
        const {currentRoundCards: previousRoundCards} = cardGameState;

        dispatch({type: 'start-next-round'});

        if (wasPreviousRoundEqual) {
            await post(`${cardGameState.deckId}/return/`, {cards: previousRoundCards!.map(card => card.code).join()});
            await post(`${cardGameState.deckId}/shuffle/`, {remaining: true});
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
        startGame,
        startNextRound,
        cardGameState
    ]);

    useEffect(() => {
        startGame();
    }, [startGame]);

    return cardGameModel;
}