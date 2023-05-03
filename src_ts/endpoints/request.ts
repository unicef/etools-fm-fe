import Dexie from 'dexie';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin';
import {etoolsCustomDexieDb} from './dexieDb';

class RequestBase {
  lastAjaxRequest: any;
  reqProgress: any;
  etoolsAjaxCacheListsExpireMapTable = 'listsExpireMapTable';

  get etoolsAjaxCacheDb(): Dexie {
    return etoolsCustomDexieDb;
  }

  _setLastAjaxRequest(a: any): void {
    this.lastAjaxRequest = a;
  }

  _setReqProgress(a: any): void {
    this.reqProgress = a;
  }
}

export const EtoolsRequest: IEtoolsRequest = new (EtoolsAjaxRequestMixin(RequestBase as any))();

export function request<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  init.headers = getHeaders(init);

  return fetch(input, init).then((response: Response) => {
    if (response.status >= 200 && response.status < 300) {
      return response.json().catch(() => response);
    } else {
      return response.text().then((error: string) => {
        try {
          const data: GenericObject = JSON.parse(error);
          const {status, statusText} = response;
          return Promise.reject({data, status, statusText});
        } catch (e) {
          return Promise.reject({data: 'UnknownError', status: 500, statusText: 'UnknownError'});
        }
      });
    }
  });
}

function getHeaders(init: RequestInit = {}): GenericObject {
  const headers: GenericObject = Object.assign({}, init.headers);
  headers['x-csrftoken'] = getToken();

  const isFormData: boolean = init.body instanceof FormData;
  if (!isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }
  if (window.EtoolsLanguage) {
    headers['language'] = window.EtoolsLanguage;
  }
  return headers;
}

function getToken(): string {
  const cookieObj: GenericObject = document.cookie
    .split(';')
    .map((pair: string): string[] => pair.trim().split('=').map(decodeURIComponent))
    .reduce((a: GenericObject, [key, value]: string[]): GenericObject => {
      try {
        a[key] = JSON.parse(value);
      } catch (error) {
        a[key] = value;
      }
      return a;
    }, {});

  return (cookieObj && cookieObj.csrftoken) || '';
}
