import {store} from '../redux/store';
import {ROOT_PATH} from '../config/config';
import {navigate} from '../redux/effects/app.effects';
import {equals, pick} from 'ramda';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {
  EtoolsRouteCallbackParams,
  EtoolsRouteDetails,
  EtoolsRouteQueryParams
} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
const routeParamRegex = '([^\\/?#=+]+)';

EtoolsRouter.init({
  baseUrl: ROOT_PATH,
  redirectPaths: {
    notFound: '/page-not-found',
    default: '/activities'
  },
  redirectedPathsToSubpageLists: []
});

EtoolsRouter
  // .addRoute(new RegExp('^engagements/list$'),
  //     (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
  //         return {
  //             routeName: 'engagements',
  //             subRouteName: 'list',
  //             path: params.matchDetails[0],
  //             queryParams: params.queryParams,
  //             params: null
  //         };
  //     })
  // .addRoute(new RegExp(`^engagements\\/${routeParamRegex}\\/${routeParamRegex}$`),
  //     (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
  //         return {
  //             routeName: 'engagements',
  //             subRouteName: params.matchDetails[2], // tab name
  //             path: params.matchDetails[0],
  //             queryParams: params.queryParams,
  //             params: {
  //                 engagementId: params.matchDetails[1]
  //             }
  //         };
  //     })
  .addRoute(new RegExp(`^templates\\/${routeParamRegex}$`), (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
    return {
      routeName: 'templates',
      subRouteName: params.matchDetails[1], // tab name
      path: params.matchDetails[0],
      queryParams: params.queryParams,
      params: null
    };
  })
  .addRoute(
    new RegExp(`^management\\/${routeParamRegex}$`),
    (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
      return {
        routeName: 'management',
        subRouteName: params.matchDetails[1], // tab name
        path: params.matchDetails[0],
        queryParams: params.queryParams,
        params: null
      };
    }
  )
  .addRoute(new RegExp(`^activities$`), (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
    return {
      routeName: 'activities',
      subRouteName: 'list',
      path: params.matchDetails[0],
      queryParams: params.queryParams,
      params: null
    };
  })
  .addRoute(
    new RegExp(`^activities\\/${routeParamRegex}$`),
    (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
      return {
        routeName: 'activities',
        subRouteName: 'item',
        path: params.matchDetails[0],
        queryParams: null,
        params: {id: params.matchDetails[1]}
      };
    }
  )
  .addRoute(
    new RegExp(`^activities\\/${routeParamRegex}\\/${routeParamRegex}$`),
    (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
      return {
        routeName: 'activities',
        subRouteName: 'item',
        path: params.matchDetails[0],
        queryParams: null,
        params: {id: params.matchDetails[1], tab: params.matchDetails[2]}
      };
    }
  )
  .addRoute(
    new RegExp(`^activities\\/${routeParamRegex}\\/data-collection\\/${routeParamRegex}$`),
    (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
      return {
        routeName: 'activities',
        subRouteName: 'data-collection',
        path: params.matchDetails[0],
        queryParams: null,
        params: {id: params.matchDetails[1], checklist: params.matchDetails[2]}
      };
    }
  )
  .addRoute(new RegExp(`^analyze\\/${routeParamRegex}$`), (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
    return {
      routeName: 'analyze',
      subRouteName: params.matchDetails[1],
      path: params.matchDetails[0],
      queryParams: params.queryParams,
      params: null
    };
  })
  .addRoute(
    new RegExp(`^analyze\\/${routeParamRegex}\\/${routeParamRegex}$`),
    (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
      return {
        routeName: 'analyze',
        subRouteName: params.matchDetails[1],
        path: params.matchDetails[0],
        queryParams: null,
        params: {tab: params.matchDetails[2]}
      };
    }
  )

  .addRoute(new RegExp(`^page-not-found$`), (params: EtoolsRouteCallbackParams): EtoolsRouteDetails => {
    return {
      routeName: 'page-not-found',
      subRouteName: null,
      path: params.matchDetails[0],
      queryParams: null,
      params: null
    };
  });

/**
 * Utility used to update location based on routes and dispatch navigate action (optional)
 */
export function updateAppLocation(newLocation: string, dispatchNavigation = true): void {
  const _newLocation: string = EtoolsRouter.prepareLocationPath(newLocation);
  EtoolsRouter.pushState(_newLocation);
  if (dispatchNavigation) {
    store.dispatch<AsyncEffect>(navigate(decodeURIComponent(_newLocation)));
  }
}

export function updateQueryParams(newQueryParams: EtoolsRouteQueryParams, reset = false): boolean {
  const details: EtoolsRouteDetails | null = EtoolsRouter.getRouteDetails();
  const path: string = (details && details.path) || '';
  let currentParams: EtoolsRouteQueryParams | null = details && details.queryParams;
  if (reset) {
    currentParams = pick(['ordering', 'page_size'], currentParams);
  }
  const computed: EtoolsRouteQueryParams = Object.assign({}, currentParams, newQueryParams);
  const resultParams: EtoolsRouteQueryParams = {};

  for (const key in computed) {
    const value: any = computed[key];
    const removeParam: boolean = !value || (Array.isArray(value) && !value.length);
    if (!removeParam) {
      resultParams[key] = value;
    }
  }

  const newParamsEqualsCurrent: boolean = equals(currentParams, resultParams);
  if (newParamsEqualsCurrent && !reset) {
    return false;
  }

  EtoolsRouter.replaceState(path, EtoolsRouter.encodeQueryParams(resultParams));
  window.dispatchEvent(new CustomEvent('popstate'));
  return true;
}
