import { endpoints } from './endpoints';

const BASE_SITE = window.location.origin;
const SERVER_BACKEND = (window.location.port !== '8080');
const BASE_PATH = SERVER_BACKEND ? '/field-monitoring/' : '/';
const STAGING_DOMAIN = 'etools-staging.unicef.org';
const PRODUCTION_DOMAIN = 'etools.unicef.org';

export function getEndpoint(endpointName, data) {
    let endpoint = _.clone(endpoints[endpointName]);
    if (endpoint && endpoint.hasOwnProperty('template') && endpoint.template !== '') {
        endpoint.url = BASE_SITE + _.template(endpoint.template)(data);
    } else {
        endpoint.url = `${BASE_SITE}${endpoint.url}`;
    }
    return endpoint;
}

window.FMMixins = window.FMMixins || {};
window.FMMixins.AppConfig = Polymer.dedupingMixin(baseClass => class extends baseClass {
    constructor() {
        super();

        let etoolsCustomDexieDb = new Dexie('FM');
        etoolsCustomDexieDb.version(1).stores({
            listsExpireMapTable: '&name, expire'
        });
        window.EtoolsRequestCacheDb = etoolsCustomDexieDb;

        this.baseSite = BASE_SITE;
        this.serverBackend = SERVER_BACKEND;
        this.basePath = BASE_PATH;
        this.epsData = endpoints;
        // dexie js
        this.appDexieDb = etoolsCustomDexieDb;
        this.stagingDomain = STAGING_DOMAIN;
        this.productionDomain = PRODUCTION_DOMAIN;
    }

    getEndpoint(endpointName, data) {
        return getEndpoint(endpointName, data);
    }

    resetOldUserData() {
        console.log('resetOldUserData()');
        localStorage.removeItem('userId');
        this.appDexieDb.listsExpireMapTable.clear();
    }

    getAbsolutePath(path) {
        path = path || '';
        return this.basePath + path;
    }

    isProductionServer() {
        let location = window.location.href;
        return location.indexOf(PRODUCTION_DOMAIN) > -1;
    }

    isStagingServer() {
        let location = window.location.href;
        return location.indexOf(STAGING_DOMAIN) > -1;
    }
});
