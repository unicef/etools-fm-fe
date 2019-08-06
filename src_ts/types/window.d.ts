import { compose } from 'redux';

declare global {
    /* tslint:disable:interface-name */
    interface Window {
        process?: Record<string, any>;
        __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose; // eslint-disable-line
    }
}
