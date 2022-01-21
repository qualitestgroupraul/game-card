const baseUrl = 'https://deckofcardsapi.com/api/deck/';

export async function get(path: string) {
    return (await fetch(`${baseUrl}${path}`)).json();
}

export async function post(path: string, data?: Object) {
    let body: FormData | undefined;

    if (data) {
        body = new FormData();

        Object.entries(data).forEach(([key, value]) => body!.append(key, value));
    }

    return (await fetch(`${baseUrl}${path}`, {method: 'post', body})).json();
}