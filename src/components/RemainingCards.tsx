import React from 'react';

type Props = {
    remainingCardsCount: number
}

export default function RemainingCards({remainingCardsCount}: Props) {
    return <div>Reamining cards count is {remainingCardsCount}.</div>
}