export const PROFILE_ENDPOINT: string = 'userProfile';

export const etoolsEndpoints: IEtoolsEndpoints = {
    [PROFILE_ENDPOINT]: {
        url: 'http://localhost:8082/api/v3/users/profile/'
    }
    // agreements: {
    //   template: '/api/v2/agreements/',
    //   exp: 30 * 60 * 1000, // 30min
    //   cacheTableName: 'agreements'
    // },
};
