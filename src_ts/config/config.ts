const PROD_DOMAIN: string = 'etools.unicef.org';
const STAGING_DOMAIN: string = 'etools-staging.unicef.org';
const DEV_DOMAIN: string = 'etools-dev.unicef.org';
const DEMO_DOMAIN: string = 'etools-demo.unicef.org';

export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY: string = 'etoolsAppSmallMenuIsActive';
export const ROOT_PATH: string = '/fm/';

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
