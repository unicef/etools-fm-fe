import AjaxRequestMixin from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-request-mixin';
import {etoolsCustomDexieDb} from './dexieDb';
import {getErrorsArray} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';

class RequestBase {
  lastAjaxRequest: any;
  reqProgress: any;
  etoolsAjaxCacheListsExpireMapTable = 'listsExpireMapTable';

  get etoolsAjaxCacheDb() {
    return etoolsCustomDexieDb;
  }

  _setLastAjaxRequest(a: any): void {
    this.lastAjaxRequest = a;
  }

  _setReqProgress(a: any): void {
    this.reqProgress = a;
  }
}

export const EtoolsRequest: IEtoolsRequest = new (AjaxRequestMixin(RequestBase as any))();

export function request<T>(input: RequestInfo, init: RequestInit = {}): Promise<T> {
  init.headers = getHeaders(init);

  return fetch(input, init)
    .then((response: Response) => {
      if (response.status >= 200 && response.status < 300) {
        return response.json().catch(() => response);
      } else {
        return response.text().then((error: string) => {
          try {
            const data: GenericObject = JSON.parse(error);
            const errorsArray = getErrorsArray(data);
            const {status, statusText: initialStatusText} = response;
            let statusText = initialStatusText;
            if (errorsArray && errorsArray.length) {
              statusText = errorsArray.join('\n');
            }
            return Promise.reject({data, status, statusText: statusText, initialResponse: response});
          } catch {
            return Promise.reject({
              data: 'UnknownError',
              status: 500,
              statusText: 'UnknownError',
              initialResponse: response
            });
          }
        });
      }
    })
    .catch((err) => {
      return Promise.reject(err);
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
      } catch {
        a[key] = value;
      }
      return a;
    }, {});

  return (cookieObj && cookieObj.csrftoken) || '';
}
