export function request(input: RequestInfo, init: RequestInit = {}) {
    const csrfToken = getToken();
    init = R.set(R.lensPath(['headers', 'x-csrftoken']), csrfToken, init);

    const isformData = init.body instanceof FormData;
    if (!isformData && !R.path(['headers', 'Content-Type'], init)) {
        init = R.set(R.lensPath(['headers', 'Content-Type']), 'application/json', init);
    }

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

function getToken() {
    const cookieObj = document.cookie.split(';').map(function(c) {
        return c.trim().split('=').map(decodeURIComponent);
    }).reduce(function(a, b) {
        try {
            // @ts-ignore
            a[b[0]] = JSON.parse(b[1]);
        } catch (e) {
            // @ts-ignore
            a[b[0]] = b[1];
        }
        return a;
    }, {});

    // @ts-ignore
    return (cookieObj && cookieObj.csrftoken) || '';
}