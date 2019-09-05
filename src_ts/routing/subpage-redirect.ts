// define here main routes that need redirect to list subRoute
import { ROOT_PATH } from '../config/config';
import { Router } from './router';

const redirectsList: GenericObject = {
    'engagements': 'engagements/list',
    'settings': 'settings/questions',
    'plan': 'plan/issue-tracker'
};
export function getRedirectToListPath(path: string): undefined | string {
    path = path.replace(ROOT_PATH, '');
    const route: string = Router.clearSlashes(path);
    const redirectTo: string | undefined = redirectsList[route];
    return redirectTo ? `${ROOT_PATH}${redirectTo}` : undefined;
}
