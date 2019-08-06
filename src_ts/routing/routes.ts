import { Router } from './router';
import { store } from '../redux/store';
import { ROOT_PATH } from '../config/config';
import { navigate } from '../redux/effects/app.effects';

export const EtoolsRouter: Router = new Router(ROOT_PATH);
const routeParamRegex: string = '([^\\/?#=+]+)';

EtoolsRouter
    .addRoute(new RegExp('^engagements/list'),
        (params: IRouteCallbackParams): IRouteDetails => {
            return {
                routeName: 'engagements',
                subRouteName: 'list',
                path: params.matchDetails[0],
                queryParams: params.queryParams,
                params: null
            };
        })
    .addRoute(new RegExp(`^engagements\\/${routeParamRegex}\\/${routeParamRegex}$`),
        (params: IRouteCallbackParams): IRouteDetails => {
            return {
                routeName: 'engagements',
                subRouteName: params.matchDetails[2], // tab name
                path: params.matchDetails[0],
                queryParams: params.queryParams,
                params: {
                    engagementId: params.matchDetails[1]
                }
            };
        })
    .addRoute(new RegExp(`^page-not-found$`),
        (params: IRouteCallbackParams): IRouteDetails => {
            return {
                routeName: 'page-not-found',
                subRouteName: null,
                path: params.matchDetails[0],
                queryParams: null,
                params: null
            };
        })
    .addRoute(new RegExp(`^page-two$`),
        (params: IRouteCallbackParams): IRouteDetails => {
            return {
                routeName: 'page-two',
                subRouteName: null,
                path: params.matchDetails[0],
                queryParams: null,
                params: null
            };
        });

/**
 * Utility used to update location based on routes and dispatch navigate action (optional)
 */
export function updateAppLocation(newLocation: string, dispatchNavigation: boolean = true): void {
    const _newLocation: string = EtoolsRouter.prepareLocationPath(newLocation);
    let navigationCallback: (() => void) | null = null;
    if (dispatchNavigation) {
        navigationCallback = () => {
            store.dispatch<AsyncEffect>(navigate(decodeURIComponent(_newLocation)));
        };
    }
    EtoolsRouter.navigate(_newLocation, navigationCallback);
}

export const ROUTE_404: string = '/page-not-found';
export const DEFAULT_ROUTE: string = '/engagements/list';
