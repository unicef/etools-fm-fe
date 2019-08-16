import { compose } from 'redux';

declare global {
    /* tslint:disable:interface-name */
    interface Window {
        process?: Record<string, any>;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose; // eslint-disable-line
    }
}

declare global {
    /*  eslint-disable @typescript-eslint/no-empty-interface */
    /* tslint:disable:no-empty-interface */
    interface L {
    }
}
