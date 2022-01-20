import React from 'react';
import {Card} from '../types';
import styled, {css} from 'styled-components';

type Props = {
    isLoadingNextRound: boolean,
    currentRoundCards: Card[] | null,
    currentRoundWinnerIndex: 0 | 1 | 'equal' | null,
    gameWinnerIndex: number | null,
    onStartNextRound: () => void,
    onStartNewGame: () => void
};

export default function CurrentRoundCards({
    isLoadingNextRound,
    currentRoundCards,
    currentRoundWinnerIndex,
    gameWinnerIndex,
    onStartNextRound,
    onStartNewGame
}: Props) {
    if (isLoadingNextRound) {
        return <div>Fetching cards...</div>;
    }

    return <div>
        {gameWinnerIndex !== null
            ? <div>
                Winner: {gameWinnerIndex === 0 ? 'player 1' : 'player 2'}
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
                    <Image src={currentRoundCards[0].image} winner={currentRoundWinnerIndex === 0} />
                </div>
                <div>
                    <div>Player 2:</div>
                    <Image src={currentRoundCards[1].image} winner={currentRoundWinnerIndex === 1} />
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