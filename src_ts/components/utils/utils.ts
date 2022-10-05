import {appLanguages} from '../../config/app-constants';

export const languageIsAvailableInApp = (lngCode: string): boolean => {
  return appLanguages.some((lng) => lng.value === lngCode);
};
