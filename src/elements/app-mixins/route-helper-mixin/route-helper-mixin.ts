window.FMMixins = window.FMMixins || {};
/*
 * Mixin for support query params in router.
 * @polymer
 * @mixinFunction
 */
window.FMMixins.RouteHelperMixin = (superClass: any) => class extends superClass {

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            queryParams: {
                type: Object,
                value: () => {}
            },
            isActive: {
                type: Boolean,
                observer: '_changeActive'
            }
        };
    }

    public _changeActive(isActive: boolean) {
        if (!isActive) { return; }
        const path = this.getRoutePath();
        if (path !== location.pathname) { this.clearQueryString(path); }
        const initQueryParams = this.getInitQueryParams();
        const queryString = this.getQueryString();
        const queryParams = this.queryParams || this.decodeParams(queryString);
        this.updateQueryParams(Object.assign({}, initQueryParams, queryParams));
        this.finishLoad();
    }

    /**
     * Get query params object from query string
     * @param {string} qs
     * @returns {QueryParams}
     */
    public decodeParams(qs: string): QueryParams {
        const params: QueryParams = {};
        qs = (qs || '').replace(/^\?/, '').replace(/\+/g, '%20');
        const paramList = qs.split('&');
        for (let i = 0; i < paramList.length; i++) {
            const param = paramList[i].split('=');
            if (param[0]) {
                params[decodeURIComponent(param[0])] =
                    decodeURIComponent(param[1] || '');
            }
        }
        return params;
    }

    /**
     * Get query string from query params object
     * @param {QueryParams} params
     * @returns {string}
     */
    public encodeParams(params: QueryParams): string {
        const encodedParams = [];
        const keys = Object.keys(params);

        for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const value = params[key];
            const encodedKey = encodeURIComponent(key);
            if (value === '') {
                encodedParams.push(encodedKey);
            } else if (value) {
                const encodedValue = encodeURIComponent(value.toString());
                encodedParams.push(`${encodedKey}=${encodedValue}`);
            }
        }
        return encodedParams.join('&');
    }

    public getLocationProperty(property: keyof Location): any {
        return window && window.location && window.location[property] || '';
    }

    /**
     * Get query string from location.search
     * @returns {string}
     */
    public getQueryString(): string {
        return this.getLocationProperty('search');
    }

    /**
     * Get full path from Route
     * @returns {string}
     */
    public getRoutePath(): string {
        const { prefix, path } = this.route;
        return `${prefix}${path}`;
    }

    public updateQueryParams(...params: QueryParams[]) {
        this.queryParams = Object.assign({}, this.queryParams, ...params);
        const path = this.getRoutePath();
        const qs = this.encodeParams(this.queryParams);
        this.updateQueryString(path, qs);
    }

    public updateQueryString(path: string, qs: string) {
        const currentState = window.history.state;
        const url = `${path}${qs.length ? '?' + qs : ''}`;
        window.history.replaceState(currentState, '', url);
        this.dispatchEvent(new CustomEvent('location-changed', {bubbles: true, composed: true}));
    }

    public clearQueryString(path: string) {
        window.history.replaceState({}, '', path);
        this.dispatchEvent(new CustomEvent('location-changed', {bubbles: true, composed: true}));
    }

    /**
     * Use for set init query params. Call every time active configured route
     * @returns {QueryParams}
     */
    public getInitQueryParams(): QueryParams { return {}; }

    /**
     * Call after active configured route
     */
    public finishLoad(): void { }
};
