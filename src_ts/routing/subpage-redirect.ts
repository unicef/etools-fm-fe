// define here main routes that need redirect to list subRoute
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';
import {Router} from './router';

const redirectsList: GenericObject = {
  templates: 'templates/questions',
  management: 'management/rationale',
  analyze: 'analyze/country-overview'
};

export function getRedirectToListPath(path: string): undefined | string {
  path = path.replace(Environment.basePath, '');
  const route: string = Router.clearSlashes(path);
  const redirectTo: string | undefined = redirectsList[route];
  return redirectTo ? `${Environment.basePath}${redirectTo}` : undefined;
}
