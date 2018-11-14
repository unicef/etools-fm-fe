export function request(input: RequestInfo, init?: RequestInit) {
    if (init && !_.get(init, `headers['Content-Type']`)) {
        _.set(init, `headers['Content-Type']`, 'application/json');
    }
    return fetch(input, init)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response.json().catch(() => response);
            } else {
                return response
                    .text()
                    .then((error) => Promise.reject(JSON.parse(error)));
            }
        });
}