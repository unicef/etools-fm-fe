export const PROFILE_ENDPOINT: string = 'userProfile';
export const CHANGE_COUNTRY: string = 'changeCountry';

export const etoolsEndpoints: IEtoolsEndpoints = {
    [PROFILE_ENDPOINT]: {
        url: '/api/v3/users/profile/'
    },
    [CHANGE_COUNTRY]: {
        url: '/api/v3/users/changecountry/'
    }
    // agreements: {
    //   template: '/api/v2/agreements/',
    //   exp: 30 * 60 * 1000, // 30min
    //   cacheTableName: 'agreements'
    // },
};
