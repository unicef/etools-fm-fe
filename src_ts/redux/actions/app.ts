import {Action, ActionCreator} from 'redux';
import {ThunkAction} from 'redux-thunk';
import {RootState} from '../store';
import {ROOT_PATH} from '../../config/config';
import {
  DEFAULT_ROUTE,
  EtoolsRouter,
  needsRedirectToList,
  ROUTE_404,
  routesLazyLoadComponents,
  updateAppLocation
} from '../../routing/routes';
import {TRouteMatchDetails} from '../../routing/router';

export const UPDATE_ROUTE_DETAILS = 'UPDATE_ROUTE_DETAILS';
export const UPDATE_DRAWER_STATE = 'UPDATE_DRAWER_STATE';

export interface AppActionUpdateRouteDetails
    extends Action<'UPDATE_ROUTE_DETAILS'> {routeDetails: any};
export interface AppActionUpdateDrawerState extends Action<'UPDATE_DRAWER_STATE'> {opened: boolean};

export type AppAction = AppActionUpdateRouteDetails | AppActionUpdateDrawerState;

type ThunkResult = ThunkAction<void, RootState, undefined, AppAction>;

const updateStoreRouteDetails: ActionCreator<AppActionUpdateRouteDetails> = (routeDetails: any) => {
  return {
    type: UPDATE_ROUTE_DETAILS,
    routeDetails
  };
};

const loadPageComponents: ActionCreator<ThunkResult> = (routeDetails: TRouteMatchDetails) => (dispatch) => {
  console.log('loadPageComponents', routeDetails);
  if (!routeDetails) {
    // invalid route => redirect to 404 page
    updateAppLocation(ROUTE_404, true);
    return;
  }

  // start importing components (lazy loading
  let routeImportsPathsKey: string = routeDetails.routeName;
  if (routeDetails.subRouteName) {
    routeImportsPathsKey += `_${routeDetails.subRouteName}`;
  }

  const filesToImport: string[] = routesLazyLoadComponents[routeImportsPathsKey];
  if (!filesToImport || filesToImport.length === 0) {
    throw new Error('No file imports configuration found (routesLazyLoadComponents)!');
  }

  const importBase: string = '../../'; // relative to current file
  filesToImport.forEach((filePath: string) => {
    import(importBase + filePath).then(() => {
      console.log(`component: ${filePath} has been loaded... yey!`);
    }).catch((importError: any) => {
      console.log('component import failed...', importError);
    });
  });

  // add page details to redux store, to be used in other components
  dispatch(updateStoreRouteDetails(routeDetails));
};

export const updateDrawerState: ActionCreator<AppActionUpdateDrawerState> = (opened: boolean) => {
  return {
    type: UPDATE_DRAWER_STATE,
    opened
  };
};

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch) => {
  // Check if path matches a valid app route, use route details to load required page components

  // if app route is accessed, redirect to default route (if not already on it)
  if (path === ROOT_PATH && ROOT_PATH !== DEFAULT_ROUTE) {
    updateAppLocation(DEFAULT_ROUTE, true);
    return;
  }

  // some routes need redirect to subRoute list
  const redirectPath: string | undefined =  needsRedirectToList(path);
  if (redirectPath) {
    updateAppLocation(redirectPath, true);
    return;
  }

  const routeDetails: TRouteMatchDetails | null = EtoolsRouter.checkRouteDetails(path);
  /**
   * TODO:
   *  - import tab component too in loadPageComponents action ????
   *  - create template page with detail about routing (including tabs subpages navigation), creating a new page
   */
  dispatch(loadPageComponents(routeDetails));
};