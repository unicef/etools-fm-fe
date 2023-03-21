import {RouteQueryParams} from '@unicef-polymer/etools-types';
import {appLanguages} from '../../config/app-constants';
import path from 'ramda/es/path';

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

export const getChoices = (data: any, prop: string): any => {
  return path(['actions', 'GET', prop, 'choices'], data) || path(['actions', 'POST', prop, 'choices'], data);
};

export const getFromPath = (data: any, props: string[]): any => {
  return path(props, data);
};

export const resetError = (event: any): void => {
  event.target.invalid = false;
};

export const canEditField = (permissions: GenericObject, field: string): boolean => {
  return Boolean(
    getFromPath(permissions, ['actions', 'POST', field]) || getFromPath(permissions, ['actions', 'PUT', field])
  );
};

export const isRequired = (permissions: GenericObject, field: string): boolean => {
  return Boolean(
    getFromPath(permissions, ['actions', 'POST', field, 'required']) ||
      getFromPath(permissions, ['actions', 'PUT', field, 'required'])
  );
};

export const getMaxLength = (permissions: GenericObject, field: string): number => {
  return getFromPath(permissions, ['actions', 'GET', field, 'max_length']);
};
