export const PROFILE_ENDPOINT: 'userProfile' = 'userProfile';
export const CP_OUTCOMES_ENDPOINT: 'cpOutcomes' = 'cpOutcomes';
export const LOCATIONS_ENDPOINT: 'locations' = 'locations';
export const CHANGE_COUNTRY: 'changeCountry' = 'changeCountry';
export const UNICEF_USER: 'unicefUsers' = 'unicefUsers';
export const SITES_EXPORT: 'unicefUsers' = 'unicefUsers';
export const SITES_LIST: 'siteLocations' = 'siteLocations';
export const SITE_DETAILS: 'siteLocationsDetails' = 'siteLocationsDetails';
export const CURRENT_WORKSPACE: 'currentWorkspace' = 'currentWorkspace';

export const etoolsEndpoints: IEtoolsEndpoints = {
    [PROFILE_ENDPOINT]: {
        url: '/api/v3/users/profile/'
    },

    [CP_OUTCOMES_ENDPOINT]: {
        template: '/api/v1/field-monitoring/settings/results/?result_type=outcome',
        exp: 60 * 60 * 1000, // 1 hour
        cacheTableName: 'cpOutcomes'
    },

    [LOCATIONS_ENDPOINT]: {
        url: '/api/locations-light/',
        exp: 25 * 60 * 60 * 1000, // 25h
        cacheTableName: 'locations'
    },
    [CHANGE_COUNTRY]: {
        url: '/api/v3/users/changecountry/'
    },
    [UNICEF_USER]: {
        url: '/api/v3/users/?verbosity=minimal',
        exp: 60 * 60 * 1000, // 1h
        cachingKey: 'unicefUsers'
    },

    [SITES_EXPORT]: {
        url: '/api/v1/field-monitoring/settings/sites/export/'
    },

    [SITES_LIST]: {
        url: '/api/v1/field-monitoring/settings/sites/?page_size=all'
    },

    [SITE_DETAILS]: {
        template: '/api/v1/field-monitoring/settings/sites/<%=id%>/'
    },

    [CURRENT_WORKSPACE]: {
        url: '/api/v1/field-monitoring/settings/locations/country/'
    }
    // agreements: {
    //   template: '/api/v2/agreements/',
    //   exp: 30 * 60 * 1000, // 30min
    //   cacheTableName: 'agreements'
    // },
};
