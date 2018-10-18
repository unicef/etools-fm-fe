import { endpoints } from './endpoints';

window.FMMixins = window.FMMixins || {};
window.FMMixins.AppConfig = Polymer.dedupingMixin(baseClass => class extends baseClass {
    constructor() {
        super();

        let etoolsCustomDexieDb = new Dexie('FM');
        etoolsCustomDexieDb.version(1).stores({
            listsExpireMapTable: '&name, expire'
        });
        window.EtoolsRequestCacheDb = etoolsCustomDexieDb;

        this.baseSite = window.location.origin;
        this.serverBackend = (window.location.port !== '8080');
        this.basePath = this.serverBackend ? '/field-monitoring/' : '/';
        this.epsData = endpoints;
        // dexie js
        this.appDexieDb = etoolsCustomDexieDb;
        this.stagingDomain = 'etools-staging.unicef.org';
        this.productionDomain = 'etools.unicef.org';
    }

    getEndpoint(endpointName, data) {
        let endpoint = _.clone(this.epsData[endpointName]);
        if (endpoint && endpoint.hasOwnProperty('template') && endpoint.template !== '') {
            endpoint.url = this.baseSite + _.template(endpoint.template)(data);
        }
        return endpoint;
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
        return location.indexOf(this.productionDomain) > -1;
    }

    isStagingServer() {
        let location = window.location.href;
        return location.indexOf(this.stagingDomain) > -1;
    }
});
