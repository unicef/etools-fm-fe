import NumberComparer = Chai.NumberComparer;

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
                type: Object
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
        this.queryParams = {}; // initialization query params
        this.updateQueryParams(Object.assign({}, initQueryParams, queryParams));
        this.initStarLoad();
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
                const key = decodeURIComponent(param[0]);
                const value = decodeURIComponent(param[1] || '');
                if (this.isArrayParam(param)) {
                    const valueItems = value.split(',');
                    params[key] = valueItems.map((item: string) => {
                        return !Number.isNaN(+item) ? +item : item;
                    });
                } else if (!Number.isNaN(+value)) {
                    params[key] = +value;
                } else {
                    params[key] = value;
                }
            }
        }
        return params;
    }

    public isArrayParam(param: any) {
        return param[0].endsWith('__in') || param[1] && !!~param[1].indexOf(',');
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
            if (value) {
                let encodedValue: string;
                encodedValue = Array.isArray(value) ?
                    value.map((param) => (encodeURIComponent(param.toString()))).join(',') :
                    encodeURIComponent(value.toString());
                if (encodedValue) {
                    encodedParams.push(`${encodedKey}=${encodedValue}`);
                }
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
        // Query Params must be initialized
        if (!this.queryParams) { return; }
        if  (!this.hasChanges(this.queryParams, ...params)) { return; }
        const queryParams = Object.assign({}, this.queryParams, ...params);
        this._updateQueryParams(queryParams);
    }

    public hasChanges(original: QueryParams, ...params: QueryParams[]) {
        return params.some((param: QueryParams) => {
            return Object.keys(param).some((key: string) => {
                return !_.isEqual(original[key], param[key]);
            });
        });
    }

    public removeQueryParams(...paramsToRemove: string[]): void {
        // Query Params must be initialized
        if (!this.queryParams) { return; }
        const queryParams: QueryParams = {};
        const paramsNames: string[] = Object.keys(this.queryParams);
        for (const paramName of paramsNames) {
            if (!~paramsToRemove.indexOf(paramName)) {
                queryParams[paramName] = this.queryParams[paramName];
            }
        }
        this._updateQueryParams(queryParams);
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
     * Call startLoad when route active first time
     */
    public initStarLoad() {
        this.startLoad();
    }

    /**
     * Call after active configured route
     */
    public startLoad(): void {
        if (!this.queryParams) { return; }
        this.finishLoad();
    }

    public finishLoad(): void {
        throw Error('Method not implemented');
    }

    private _updateQueryParams(queryParams: QueryParams) {
        this.queryParams = queryParams;
        const path = this.getRoutePath();
        const qs = this.encodeParams(queryParams);
        this.updateQueryString(path, qs);
    }
};
