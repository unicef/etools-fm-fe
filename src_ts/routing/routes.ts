import {Router} from './router';
import {store} from '../redux/store';
import {ROOT_PATH} from '../config/config';
import {navigate} from '../redux/effects/app.effects';
import {equals} from 'ramda';

export const EtoolsRouter: Router = new Router(ROOT_PATH);
const routeParamRegex = '([^\\/?#=+]+)';

EtoolsRouter
  // .addRoute(new RegExp('^engagements/list$'),
  //     (params: IRouteCallbackParams): IRouteDetails => {
  //         return {
  //             routeName: 'engagements',
  //             subRouteName: 'list',
  //             path: params.matchDetails[0],
  //             queryParams: params.queryParams,
  //             queryParamsString: params.queryParamsString,
  //             params: null
  //         };
  //     })
  // .addRoute(new RegExp(`^engagements\\/${routeParamRegex}\\/${routeParamRegex}$`),
  //     (params: IRouteCallbackParams): IRouteDetails => {
  //         return {
  //             routeName: 'engagements',
  //             subRouteName: params.matchDetails[2], // tab name
  //             path: params.matchDetails[0],
  //             queryParams: params.queryParams,
  //             queryParamsString: params.queryParamsString,
  //             params: {
  //                 engagementId: params.matchDetails[1]
  //             }
  //         };
  //     })
  .addRoute(new RegExp(`^templates\\/${routeParamRegex}$`), (params: IRouteCallbackParams): IRouteDetails => {
    return {
      routeName: 'templates',
      subRouteName: params.matchDetails[1], // tab name
      path: params.matchDetails[0],
      queryParams: params.queryParams,
      queryParamsString: params.queryParamsString,
      params: null
    };
  })
  .addRoute(new RegExp(`^management\\/${routeParamRegex}$`), (params: IRouteCallbackParams): IRouteDetails => {
    return {
      routeName: 'management',
      subRouteName: params.matchDetails[1], // tab name
      path: params.matchDetails[0],
      queryParams: params.queryParams,
      queryParamsString: params.queryParamsString,
      params: null
    };
  })
  .addRoute(new RegExp(`^activities$`), (params: IRouteCallbackParams): IRouteDetails => {
    return {
      routeName: 'activities',
      subRouteName: 'list',
      path: params.matchDetails[0],
      queryParams: params.queryParams,
      queryParamsString: params.queryParamsString,
      params: null
    };
  })
  .addRoute(new RegExp(`^activities\\/${routeParamRegex}$`), (params: IRouteCallbackParams): IRouteDetails => {
    return {
      routeName: 'activities',
      subRouteName: 'item',
      path: params.matchDetails[0],
      queryParams: null,
      queryParamsString: null,
      params: {id: params.matchDetails[1]}
    };
  })
  .addRoute(
    new RegExp(`^activities\\/${routeParamRegex}\\/${routeParamRegex}$`),
    (params: IRouteCallbackParams): IRouteDetails => {
      return {
        routeName: 'activities',
        subRouteName: 'item',
        path: params.matchDetails[0],
        queryParams: null,
        queryParamsString: null,
        params: {id: params.matchDetails[1], tab: params.matchDetails[2]}
      };
    }
  )
  .addRoute(
    new RegExp(`^activities\\/${routeParamRegex}\\/data-collection\\/${routeParamRegex}$`),
    (params: IRouteCallbackParams): IRouteDetails => {
      return {
        routeName: 'activities',
        subRouteName: 'data-collection',
        path: params.matchDetails[0],
        queryParams: null,
        queryParamsString: null,
        params: {id: params.matchDetails[1], checklist: params.matchDetails[2]}
      };
    }
  )
  .addRoute(new RegExp(`^analyze\\/${routeParamRegex}$`), (params: IRouteCallbackParams): IRouteDetails => {
    return {
      routeName: 'analyze',
      subRouteName: params.matchDetails[1],
      path: params.matchDetails[0],
      queryParams: params.queryParams,
      queryParamsString: params.queryParamsString,
      params: null
    };
  })
  .addRoute(
    new RegExp(`^analyze\\/${routeParamRegex}\\/${routeParamRegex}$`),
    (params: IRouteCallbackParams): IRouteDetails => {
      return {
        routeName: 'analyze',
        subRouteName: params.matchDetails[1],
        path: params.matchDetails[0],
        queryParams: null,
        queryParamsString: null,
        params: {tab: params.matchDetails[2]}
      };
    }
  )

  .addRoute(new RegExp(`^page-not-found$`), (params: IRouteCallbackParams): IRouteDetails => {
    return {
      routeName: 'page-not-found',
      subRouteName: null,
      path: params.matchDetails[0],
      queryParams: null,
      queryParamsString: null,
      params: null
    };
  });

/**
 * Utility used to update location based on routes and dispatch navigate action (optional)
 */
export function updateAppLocation(newLocation: string, dispatchNavigation = true): void {
  const _newLocation: string = EtoolsRouter.prepareLocationPath(newLocation);
  let navigationCallback: (() => void) | null = null;
  if (dispatchNavigation) {
    navigationCallback = () => {
      store.dispatch<AsyncEffect>(navigate(decodeURIComponent(_newLocation)));
    };
  }
  EtoolsRouter.pushState(_newLocation, {}, navigationCallback);
}

export function updateQueryParams(newQueryParams: IRouteQueryParams): boolean {
  const details: IRouteDetails | null = EtoolsRouter.getRouteDetails();
  const path: string = (details && details.path) || '';
  const queryParams: IRouteQueryParams | null = details && details.queryParams;
  const computed: IRouteQueryParams = Object.assign({}, queryParams, newQueryParams);
  const resultParams: IRouteQueryParams = {};

  for (const key in computed) {
    const value: any = computed[key];
    const removeParam: boolean = !value || (Array.isArray(value) && !value.length);
    if (!removeParam) {
      resultParams[key] = value;
    }
  }

  const newParamsEqualsCurrent: boolean = equals(queryParams, resultParams);
  if (newParamsEqualsCurrent) {
    return false;
  }

  EtoolsRouter.replaceState(path, resultParams);
  window.dispatchEvent(new CustomEvent('popstate'));
  return true;
}

export const ROUTE_404 = '/page-not-found';
export const DEFAULT_ROUTE = '/activities';
