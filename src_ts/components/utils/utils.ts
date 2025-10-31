import {GenericObject} from '@unicef-polymer/etools-types';
import {appLanguages} from '../../config/app-constants';
import path from 'ramda/es/path';

export const languageIsAvailableInApp = (lngCode: string): boolean => {
  return appLanguages.some((lng: any) => lng.value === lngCode);
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

export const pageIsActive = (pageName: string): boolean => {
  return window.location.pathname.includes(`/${pageName}`);
};

export const canEditField = (permissions: GenericObject, field: string): boolean => {
  return Boolean(
    getFromPath(permissions, ['actions', 'POST', field]) || getFromPath(permissions, ['actions', 'PUT', field])
  );
};

export const canAdd = (permissions: GenericObject | null): boolean => {
  return Boolean(getFromPath(permissions, ['actions', 'POST']));
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

export const addMissingItems = (mainArray: any[], itemsToCheckArray: any[]): any[] => {
  const missingItems: any[] = (itemsToCheckArray || []).filter(
    (s: any) => !(mainArray || []).find((f) => s.id === f.id)
  );
  if (missingItems?.length) {
    return mainArray.concat(missingItems);
  }
  return mainArray;
};

export const getErrorText = (errors: GenericObject): string => {
  let errSource = '';
  if (errors.data && errors.data !== 'UnknownError') {
    errSource = errors.data;
  } else if (errors.initialResponse?.data) {
    errSource = errors.initialResponse.data;
  }
  return Array.isArray(errSource) ? errSource.join('\n') : errSource;
};

export const setDataOnSessionStorage = (key: string, data: any): void => {
  sessionStorage.setItem(key, JSON.stringify(data));
};

export const getDataFromSessionStorage = (key: string): any => {
  const data = sessionStorage.getItem(key);
  if (data) {
    try {
      return JSON.parse(data);
    } catch (err) {
      console.log(err);
    }
  }
  return null;
};
