export interface EtoolsEndpoint {
  url?: string;
  template?: string;
  exp?: any;
  cachingKey?: string;
  cacheTableName?: string;
}
export interface EtoolsEndpoints {
  [key: string]: EtoolsEndpoint;
}

export const etoolsEndpoints: EtoolsEndpoints = {
  userProfile: {
    url: 'http://localhost:8082/api/v3/users/profile/'
  }
  // agreements: {
  //   template: '/api/v2/agreements/',
  //   exp: 30 * 60 * 1000, // 30min
  //   cacheTableName: 'agreements'
  // },
};

