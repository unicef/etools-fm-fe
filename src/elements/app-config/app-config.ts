import { endpoints } from './endpoints';

const BASE_SITE = window.location.origin;
const SERVER_BACKEND = (window.location.port !== '8080');
const BASE_PATH = SERVER_BACKEND ? '/fm/' : '/';
const STAGING_DOMAIN = 'etools-staging.unicef.org';
const PRODUCTION_DOMAIN = 'etools.unicef.org';

function isDynamicEndpoint(endpoint: Endpoint): endpoint is DynamicEndpoint {
    return endpoint.hasOwnProperty('template') && (endpoint as DynamicEndpoint).template !== '';
}

export function getEndpoint(endpointName: string): StaticEndpoint;
export function getEndpoint(endpointName: string, data: EndpointTemplateData): StaticEndpoint;
export function getEndpoint(endpointName: string, data?: EndpointTemplateData): StaticEndpoint {
    const endpoint = R.clone(endpoints[endpointName]);
    if (isDynamicEndpoint(endpoint)) {
        const urlPath = R.pipe(
            R.toPairs,
            R.reduce(
                (urlTemplate: string, pair: [string, string]) =>
                    R.replace(`<%=${pair[0]}%>`, pair[1], urlTemplate),
                endpoint.template
            )
        )(data);
        const url = `${BASE_SITE}${urlPath}`;
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
        const etoolsCustomDexieDb = new Dexie('FM');
        etoolsCustomDexieDb.version(1).stores({
            listsExpireMapTable: '&name, expire',
            methods: 'id',
            cpOutcomes: 'id',
            governmentPartners: 'id',
            monitoredPartners: 'id',
            monitoredCpOutputs: 'id',
            locations: 'id'
        });
        (window as any).EtoolsRequestCacheDb = etoolsCustomDexieDb;
        this.appDexieDb = etoolsCustomDexieDb;

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
