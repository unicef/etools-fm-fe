import { endpoints } from './endpoints';

const BASE_SITE = window.location.origin;
const SERVER_BACKEND = (window.location.port !== '8080');
const BASE_PATH = SERVER_BACKEND ? '/field-monitoring/' : '/';
const STAGING_DOMAIN = 'etools-staging.unicef.org';
const PRODUCTION_DOMAIN = 'etools.unicef.org';

function isDynamicEndpoint(endpoint: Endpoint): endpoint is DynamicEndpoint {
    return endpoint.hasOwnProperty('template') && (endpoint as DynamicEndpoint).template !== '';
}

export function getEndpoint(endpointName: string): StaticEndpoint;
export function getEndpoint(endpointName: string, data: EndpointTemplateData): StaticEndpoint;
export function getEndpoint(endpointName: string, data?: EndpointTemplateData): StaticEndpoint {
    const endpoint = _.clone(endpoints[endpointName]);
    if (isDynamicEndpoint(endpoint)) {
        const url = `${BASE_SITE}${_.template(endpoint.template)(data)}`;
        return {url, ...endpoint};
    } else {
        endpoint.url = `${BASE_SITE}${endpoint.url}`;
    }
    return endpoint;
}

export function jsonToFormData(json: any) {
    const body = new FormData();
    Object.keys(json).forEach((key) => { body.append(key, json[key]); });
    return body;
}

export function objectToQuery(obj: QueryParams) {
    const params: string[] = [];
    Object.keys(obj).forEach(key => {
        const value = obj[key];
        if (!value || Array.isArray(value) && !value.length) { return; }
        params.push(`${key}=${value}`);
    });
    const query = params.join('&');
    return query.length > 0 ? '?' + query : '';
}

window.FMMixins = window.FMMixins || {};
window.FMMixins.AppConfig = Polymer.dedupingMixin((baseClass: any) => class Config extends baseClass {
    public constructor() {
        super();

        // dexie js
        // const etoolsCustomDexieDb = new Dexie('FM');
        // etoolsCustomDexieDb.version(1).stores({
        //     listsExpireMapTable: '&name, expire'
        // });
        // (window as any).EtoolsRequestCacheDb = etoolsCustomDexieDb;
        this.appDexieDb = {};

        this.baseSite = BASE_SITE;
        this.serverBackend = SERVER_BACKEND;
        this.basePath = BASE_PATH;
        this.epsData = endpoints;
        this.stagingDomain = STAGING_DOMAIN;
        this.productionDomain = PRODUCTION_DOMAIN;
    }

    public getEndpoint(endpointName: string, data: EndpointTemplateData) {
        return getEndpoint(endpointName, data);
    }

    public resetOldUserData() {
        console.log('resetOldUserData()');
        localStorage.removeItem('userId');
        this.appDexieDb.listsExpireMapTable.clear();
    }

    public getAbsolutePath(path: string | undefined) {
        path = path || '';
        return `${this.basePath}${path}`;
    }

    public isProductionServer() {
        const location = window.location.href;
        return location.indexOf(PRODUCTION_DOMAIN) > -1;
    }

    public isStagingServer() {
        const location = window.location.href;
        return location.indexOf(STAGING_DOMAIN) > -1;
    }
});
