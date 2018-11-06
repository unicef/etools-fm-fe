window.FMMixins = window.FMMixins || {};
/*
 * Mixin for edit query string in location.
 * @polymer
 * @mixinFunction
 */
window.FMMixins.QueryParamsMixin = (superClass: any) => class extends superClass {
    /**
     * Parse queries from location to JSON object
     * @returns {{Object}} of queries key-value
     */
    public parseQueries() {
        const queriesObj: any = {};
        const queries: any = this.getQueriesString().slice(1).split('&');

        if (queries[0] === '') { return {}; }
        queries.forEach((query: any) => {
            const [key, value] = query.split('=');
            queriesObj[key] = value || true;
        });

        return queriesObj;
    }

    /**
     * Get part of location by property
     * @param property
     * @returns {Window|Location|String|*|string}
     */
    public getLocationProperty(property: keyof Location): any {
        return window && window.location && window.location[property] || '';
    }

    /**
     * Get queries part of location
     * @returns {Window|Location|String|*|string}
     */
    public getQueriesString(): any {
        return this.getLocationProperty('search');
    }

    /**
     * Get path part of location
     * @returns {string}
     */
    public getPath() {
        let path: any = this.getLocationProperty('pathname');
        if (~path.indexOf('/field-monitoring')) {path = path.slice(17); }
        return path.slice(1);
    }

    /**
     * Update queries in location by new values
     * @param newQueries
     * @param path
     * @param noNotify
     * @returns {boolean}
     */
    public updateQueries(newQueries: any, path: string, noNotify: boolean) {
        if (!_.isObject(newQueries)) {return false; }
        const keys = Object.keys(newQueries);

        if (!keys.length) {return false; }

        path = path && _.isString(path) ? path : this.getPath();
        let queries: any = this.parseQueries();

        keys.forEach((key) => {
            if (newQueries[key] === undefined || newQueries[key] === false) {
                delete queries[key];
            } else {
                queries[key] = newQueries[key];
            }
        });

        queries = Object.keys(queries).map((key) => {
            const value = typeof queries[key] === 'boolean' ? '' : `=${queries[key]}`;
            return `${key}${value}`;
        });

        try {
            window.history.replaceState({}, '', `${path}?${queries.join('&')}`);
        } catch (err) {
            console.warn(err);
        }

        if (!noNotify) {this.dispatchEvent(new CustomEvent('location-changed', {bubbles: true, composed: true})); }
        return true;
    }

    /**
     * Clear queries in location
     */
    public clearQueries() {
        try {
            window.history.replaceState({}, '', this.getLocationProperty('pathname'));
        } catch (err) {
            console.warn(err);
        }
        this.dispatchEvent(new CustomEvent('location-changed', {bubbles: true, composed: true}));
    }

    public initBaseListQueries(params: BaseListParams | undefined): void {
        const pageNumber = _.get(params, 'page', this.pageNumber);
        const pageSize = _.get(params, 'page_size', this.pageSize);
        this.set('queryParams', {
            page: pageNumber,
            page_size: pageSize
        });
    }
};
