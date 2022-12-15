import {RouteQueryParams} from '@unicef-polymer/etools-types';
import {appLanguages} from '../../config/app-constants';

export const languageIsAvailableInApp = (lngCode: string): boolean => {
  return appLanguages.some((lng: any) => lng.value === lngCode);
};

export const decodeQueryStrToObj = (paramsStr: string): RouteQueryParams => {
  const qsObj: RouteQueryParams = {} as RouteQueryParams;
  if (paramsStr) {
    const qs: string[] = paramsStr.split('&');
    qs.forEach((qp: string) => {
      const qParam = qp.split('=');
      qsObj[qParam[0]] = qParam[1];
    });
  }
  return qsObj;
};
