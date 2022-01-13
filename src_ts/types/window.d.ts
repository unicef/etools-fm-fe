import {compose} from 'redux';

declare global {
  interface Window {
    process?: Record<string, any>;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose; // eslint-disable-line
  }
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface L {}
}
