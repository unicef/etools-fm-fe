import {GenericObject} from "../../types/globals";
import {etoolsEndpoints} from './endpoints-list';

const generateUrlFromTemplate = (tmpl: string, data: object | undefined) => {
  if (!tmpl) {
    throw new Error('To generate URL from endpoint url template you need valid template string');
  }

  if (data && Object.keys(data).length > 0) {
    for (const k in data) {
      if (Object.prototype.hasOwnProperty.call(data, k)) {
        const replacePattern = new RegExp('<%=' + k + '%>', 'gi');
        tmpl = tmpl.replace(replacePattern, (data as any)[k]);
      }
    }
  }

  return tmpl;
};

export const getEndpoint = (endpointName: string, data?: GenericObject) => {
  const endpoint = etoolsEndpoints[endpointName];
  const baseSite = window.location.origin;

  if (endpoint && endpoint.template) {
    endpoint.url = baseSite + generateUrlFromTemplate(endpoint.template, data);
  } else {
    if (endpoint.url!.indexOf(baseSite) === -1) {
      endpoint.url = baseSite + endpoint.url;
    }
  }

  return endpoint;
};
