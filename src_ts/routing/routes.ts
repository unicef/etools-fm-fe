import {Router, TRouteCallbackParams, TRouteMatchDetails} from './router';
import {store} from '../redux/store';
import {navigate} from '../redux/actions/app';

export const EtoolsRouter = new Router();
const routeParamRegex: string = '([^\\/?#=+]+)';

EtoolsRouter
    .addRoute(new RegExp('^engagements\/list'),
        (params: TRouteCallbackParams): TRouteMatchDetails => {
          return {
            routeName: 'engagements',
            subRouteName: 'list',
            path: params.matchDetails[0],
            queryParams: params.queryParams,
            params: null
          };
        })
    .addRoute(new RegExp(`^engagements\\/${routeParamRegex}\\/${routeParamRegex}$`),
        (params: TRouteCallbackParams): TRouteMatchDetails => {
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
        (params: TRouteCallbackParams): TRouteMatchDetails => {
          return {
            routeName: 'page-not-found',
            subRouteName: null,
            path: params.matchDetails[0],
            queryParams: null,
            params: null
          };
        })
    .addRoute(new RegExp(`^page-two$`),
    (params: TRouteCallbackParams): TRouteMatchDetails => {
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
export const updateAppLocation = (newLocation: string, dispatchNavigation: boolean = true): void => {
  let navigationCallback = null;
  if (dispatchNavigation) {
    navigationCallback = () => {
      store.dispatch(navigate(decodeURIComponent(newLocation)));
    }
  }
  EtoolsRouter.navigate(newLocation, navigationCallback);
};

export const ROUTE_404: string = '/page-not-found';
export const DEFAULT_ROUTE: string = '/engagements/list';
