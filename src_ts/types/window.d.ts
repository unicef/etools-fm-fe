import {compose} from 'redux';

declare global {
  interface Window {
    process?: Record<string, any>;
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

declare global {
  /* eslint-disable-next-line @typescript-eslint/no-empty-object-type */
  interface L {}
}
