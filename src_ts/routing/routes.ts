import {Router, TRouteCallbackParams, TRouteMatchDetails} from './router';
import {store} from '../redux/store';
import {navigate} from '../redux/actions/app';
import {ROOT_PATH} from "../config/config";

export type TRoutesLazyLoadComponentsPath = {
  [key: string]: string[]
};

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
          console.log('engagements details page', params);
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
          console.log('page not found', params);
          return {
            routeName: 'page-not-found',
            subRouteName: null,
            path: ROUTE_404,
            queryParams: null,
            params: null
          };
        })
    .addRoute(new RegExp(`^page-two$`),
    (params: TRouteCallbackParams): TRouteMatchDetails => {
      console.log('page two', params);
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

// define here main routes that need redirect to list subRoute
export const redirectToListSubpageList = [
  'engagements'
];
export const needsRedirectToList = (path: string): undefined | string => {
  path = path.replace(ROOT_PATH, '');
  const route: string = Router.clearSlashes(path);
  const redirectTo: string | undefined = redirectToListSubpageList.find((r: string) => r === route);
  return redirectTo ? `${ROOT_PATH}${redirectTo}/list` : undefined;
};

// each key from this object is computed from routeName_routeSubPage (if subRoute exists)
export const routesLazyLoadComponents: TRoutesLazyLoadComponentsPath = {

  engagements_list: [
      'components/pages/engagements/engagements-list.js'
  ],
  engagements_details: [
    'components/pages/engagements/engagement-tabs.js',
    'components/pages/engagements/engagement-tab-pages/engagement-details.js'
  ],
  engagements_questionnaires: [
    'components/pages/engagements/engagement-tabs.js',
    'components/pages/engagements/engagement-tab-pages/engagement-questionnaires.js'
  ],
  'page-not-found': [
    'components/pages/page-not-found.js'
  ],
  'page-two': [
    'components/pages/page-two.js'
  ]

};
