export async function get(path) {
    return (await fetch(`https://deckofcardsapi.com/api/deck/${path}`)).json();
}

export async function post(path) {
    return (await fetch(`https://deckofcardsapi.com/api/deck/${path}`, {method: 'post'})).json();
}