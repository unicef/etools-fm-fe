import cookies from 'browser-cookies';

export function request(input: RequestInfo, init?: RequestInit) {
    if (init && !_.get(init, `headers['Content-Type']`)) {
        _.set(init, `headers['Content-Type']`, 'application/json');
    }
    const csrfToken = cookies.get('csrftoken') || '';
    _.set(init, `headers['x-csrftoken']`, csrfToken);

    return fetch(input, init)
        .then((response) => {
            if (response.status >= 200 && response.status < 300) {
                return response.json().catch(() => response);
            } else {
                return response
                    .text()
                    .then((error) => {
                        const data = JSON.parse(error);
                        const {status, statusText} = response;
                        return Promise.reject({data, status, statusText});
                    });
            }
        });
}