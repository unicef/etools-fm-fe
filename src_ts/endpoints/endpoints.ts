import {etoolsEndpoints} from './endpoints-list';

function generateUrlFromTemplate(tmpl: string, data: object | undefined): string {
  if (!tmpl) {
    throw new Error('To generate URL from endpoint url template you need valid template string');
  }

  if (data && Object.keys(data).length > 0) {
    for (const k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        const replacePattern: RegExp = new RegExp('<%=' + k + '%>', 'gi');
        tmpl = tmpl.replace(replacePattern, (data as any)[k]);
      }
    }
  }

  return tmpl;
}

export function getEndpoint(endpointName: string, data?: GenericObject): IResultEndpoint {
  const endpoint: IEtoolsEndpoint = etoolsEndpoints[endpointName];
  const baseSite: string = window.location.origin;

  if (endpoint && endpoint.template) {
    endpoint.url = baseSite + generateUrlFromTemplate(endpoint.template, data);
  } else if (!endpoint.url!.includes(baseSite)) {
    endpoint.url = baseSite + endpoint.url;
  }

  return endpoint as IResultEndpoint;
}
