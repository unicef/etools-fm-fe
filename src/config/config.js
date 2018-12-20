const PROD_DOMAIN = 'etools.unicef.org';
const STAGING_DOMAIN = 'etools-staging.unicef.org';
const DEV_DOMAIN = 'etools-dev.unicef.org';
const DEMO_DOMAIN = 'etools-demo.unicef.org';
export const isProductionServer = () => {
    let location = window.location.href;
    return location.indexOf(PROD_DOMAIN) > -1;
};
export const isStagingServer = () => {
    let location = window.location.href;
    return location.indexOf(STAGING_DOMAIN) > -1;
};
export const isDevServer = () => {
    return window.location.href.indexOf(DEV_DOMAIN) > -1;
};
export const isDemoServer = () => {
    return window.location.href.indexOf(DEMO_DOMAIN) > -1;
};
