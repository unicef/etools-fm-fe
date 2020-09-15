import {compose} from 'redux';

declare global {
  interface Window {
    process?: Record<string, any>;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose; // eslint-disable-line
  }
}

declare global {
  interface L {}
}
