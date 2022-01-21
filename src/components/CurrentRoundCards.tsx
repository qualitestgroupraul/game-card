import React from 'react';
import {Card, Winner} from '../types';
import styled, {css} from 'styled-components';

type Props = {
    isLoadingNextRound: boolean,
    currentRoundCards: Card[] | null,
    currentRoundWinner: Winner | null,
    gameWinner: Winner | null,
    onStartNextRound: () => void,
    onStartNewGame: () => void
};

export default function CurrentRoundCards({
    isLoadingNextRound,
    currentRoundCards,
    currentRoundWinner,
    gameWinner,
    onStartNextRound,
    onStartNewGame
}: Props) {
    if (isLoadingNextRound) {
        return <div>Fetching cards...</div>;
    }

    return <div>
        {gameWinner !== null
            ? <div>
                {gameWinner === 'equal'
                    ? 'Equality!'
                    : `Winner: ${gameWinner === 'player1' ? 'player 1' : 'player 2'}!`}
                <div>
                    <button onClick={onStartNewGame}>start new game</button>
                </div>
            </div>
            : <div>
                <button onClick={onStartNextRound}>start round</button>
            </div>}
        {currentRoundCards
            ? <ImagesContainer>
                <div>
                    <div>Player 1:</div>
                    <Image src={currentRoundCards[0].image} winner={currentRoundWinner === 'player1'} />
                </div>
                <div>
                    <div>Player 2:</div>
                    <Image src={currentRoundCards[1].image} winner={currentRoundWinner === 'player2'} />
                </div>
            </ImagesContainer>
            : null}
    </div>;
}

const ImagesContainer = styled.div`
    display: flex;
`;

const Image = styled.img<{winner: boolean}>`
    margin: 10px;

    ${props => props.winner && css`
        outline: 5px solid #9f0;
        border-radius: 10px;
    `}
`;