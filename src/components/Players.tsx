import * as React from 'react';

type Props = {
    player1CardsCount: number,
    player2CardsCount: number
}

export default function Players({player1CardsCount, player2CardsCount}: Props): JSX.Element {
    return <div>
        <div>Player 1 has {player1CardsCount} cards.</div>
        <div>Player 2 has {player2CardsCount} cards.</div>
    </div>
}