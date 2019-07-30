export interface IEtoolsEndpoint {
  url?: string;
  template?: string;
  exp?: any;
  cachingKey?: string
  cacheTableName?: string
}
export interface IEtoolsEndpoints {
  [key: string]: IEtoolsEndpoint;
}

export const etoolsEndpoints: IEtoolsEndpoints = {
  userProfile: {
    url: 'http://localhost:8082/api/v3/users/profile/'
  },
  // agreements: {
  //   template: '/api/v2/agreements/',
  //   exp: 30 * 60 * 1000, // 30min
  //   cacheTableName: 'agreements'
  // },
};

