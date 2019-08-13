export const PROFILE_ENDPOINT: string = 'userProfile';
export const CP_OUTCOMES_ENDPOINT: string = 'cpOutcomes';
export const LOCATIONS_ENDPOINT: string = 'locations';
export const CHANGE_COUNTRY: string = 'changeCountry';
export const UNICEF_USER: string = 'unicefUsers';

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
    }
    // agreements: {
    //   template: '/api/v2/agreements/',
    //   exp: 30 * 60 * 1000, // 30min
    //   cacheTableName: 'agreements'
    // },
};
