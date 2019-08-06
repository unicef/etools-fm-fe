const PROD_DOMAIN: string = 'etools.unicef.org';
const STAGING_DOMAIN: string = 'etools-staging.unicef.org';
const DEV_DOMAIN: string = 'etools-dev.unicef.org';
const DEMO_DOMAIN: string = 'etools-demo.unicef.org';

export const SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY: string = 'etoolsAppSmallMenuIsActive';
export const ROOT_PATH: string = '/';

export function isProductionServer(): boolean {
    const location: string = window.location.href;
    return location.indexOf(PROD_DOMAIN) > -1;
}

export function isStagingServer(): boolean {
    const location: string = window.location.href;
    return location.indexOf(STAGING_DOMAIN) > -1;
}

export function isDevServer(): boolean {
    return window.location.href.indexOf(DEV_DOMAIN) > -1;
}

export function isDemoServer(): boolean {
    return window.location.href.indexOf(DEMO_DOMAIN) > -1;
}
