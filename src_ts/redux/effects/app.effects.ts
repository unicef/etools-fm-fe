import {ThunkAction} from 'redux-thunk';
import {AppAction, UpdateStoreRouteDetails} from '../actions/app.actions';
import {getFilePathsToImport} from '../../routing/component-lazy-load-config';
import {DEFAULT_ROUTE, EtoolsRouter, ROUTE_404, updateAppLocation} from '../../routing/routes';
import {ROOT_PATH} from '../../config/config';
import {ActionCreator, Dispatch} from 'redux';
import {getRedirectToListPath} from '../../routing/subpage-redirect';
import {GlobalLoadingUpdate} from '../actions/global-loading.actions';

type ThunkResult = ThunkAction<void, IRootState, undefined, AppAction>;

const loadPageComponents: ActionCreator<ThunkResult> = (routeDetails: IRouteDetails) => (dispatch: Dispatch) => {
  if (!routeDetails) {
    // invalid route => redirect to 404 page
    updateAppLocation(ROUTE_404, true);
    return;
  }

  const importBase = '../../'; // relative to current file
  // start importing components (lazy loading)
  const lazyImports: Promise<any>[] = getFilePathsToImport(routeDetails).map((filePath: string) =>
    import(importBase + filePath)
  );

  dispatch(new GlobalLoadingUpdate('Loading...'));
  Promise.all(lazyImports).finally(() => dispatch(new GlobalLoadingUpdate(null)));

  // add page details to redux store, to be used in other components
  dispatch(new UpdateStoreRouteDetails(routeDetails));
};

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch: any) => {
  // Check if path matches a valid app route, use route details to load required page components

  // if app route is accessed, redirect to default route (if not already on it)
  if (path === ROOT_PATH) {
    updateAppLocation(DEFAULT_ROUTE, true);
    return;
  }

  // some routes need redirect to subRoute list
  const redirectPath: string | undefined = getRedirectToListPath(path);
  if (redirectPath) {
    updateAppLocation(redirectPath, true);
    return;
  }

  const routeDetails: IRouteDetails | null = EtoolsRouter.getRouteDetails(path);
  /**
   * TODO:
   *  - create template page with detail about routing (including tabs subpages navigation), creating a new page
   */
  dispatch(loadPageComponents(routeDetails));
};
