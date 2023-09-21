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
