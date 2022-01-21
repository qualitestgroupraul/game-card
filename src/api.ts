export async function get(path: string) {
    return (await fetch(`https://deckofcardsapi.com/api/deck/${path}`)).json();
}

export async function post(path: string, data?: Object) {
    let body: FormData | undefined;

    if (data) {
        body = new FormData();

        Object.entries(data).forEach(([key, value]) => body!.append(key, value));
    }

    return (await fetch(`https://deckofcardsapi.com/api/deck/${path}`, {method: 'post', body})).json();
}