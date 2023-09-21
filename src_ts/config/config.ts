const PROD_DOMAIN = 'etools.unicef.org';
const STAGING_DOMAIN = 'etools-staging.unicef.org';
const DEV_DOMAIN = 'etools-dev.unicef.org';
const DEMO_DOMAIN = 'etools-demo.unicef.org';

export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY = 'etoolsAppSmallMenuIsActive';
export const ROOT_PATH = '/fm/';

declare global {
  interface Window {
    EtoolsEsmmFitIntoEl: any;
    EtoolsLanguage: string;
  }
}

export function isProductionServer(): boolean {
  const location: string = window.location.href;
  return location.includes(PROD_DOMAIN);
}

export function isStagingServer(): boolean {
  const location: string = window.location.href;
  return location.includes(STAGING_DOMAIN);
}

export function isDevServer(): boolean {
  return window.location.href.includes(DEV_DOMAIN);
}

export function isDemoServer(): boolean {
  return window.location.href.includes(DEMO_DOMAIN);
}
