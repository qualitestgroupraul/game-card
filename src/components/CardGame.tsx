import React from 'react';
import Players from './Players';
import CurrentRoundCards from './CurrentRoundCards';
import RemainingCards from './RemainingCards';
import useCardGame from '../hooks/use-card-game';

export default function CardGame() {
    const {
        isGameInitialized,
        isLoadingGame,
        player1CardsCount,
        player2CardsCount,
        isLoadingNextRound,
        currentRoundCards,
        currentRoundWinner,
        remainingCardsCount,
        gameWinner,
        startNextRound,
        startGame
    } = useCardGame();

    if (isLoadingGame) {
        return <div>Preparing new game, please wait...</div>;
    }

    if (!isGameInitialized) {
        return null;
    }

    return <div>
        <Players player1CardsCount={player1CardsCount} player2CardsCount={player2CardsCount} />
        <CurrentRoundCards
            isLoadingNextRound={isLoadingNextRound}
            currentRoundCards={currentRoundCards}
            currentRoundWinner={currentRoundWinner}
            gameWinner={gameWinner}
            onStartNextRound={startNextRound}
            onStartNewGame={startGame} />
        <RemainingCards remainingCardsCount={remainingCardsCount} />
    </div>;
}

