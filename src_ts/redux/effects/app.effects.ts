/* eslint-disable max-len */
import {ThunkAction} from 'redux-thunk';
import {AppAction, UpdateStoreRouteDetails} from '../actions/app.actions';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {ActionCreator, Dispatch} from 'redux';
import {getRedirectToListPath} from '../../routing/subpage-redirect';
import {GlobalLoadingUpdate} from '../actions/global-loading.actions';
import {EtoolsRedirectPath} from '@unicef-polymer/etools-utils/dist/enums/router.enum';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {waitForCondition} from '@unicef-polymer/etools-utils/dist/wait.util';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';

type ThunkResult = ThunkAction<void, IRootState, undefined, AppAction>;

const loadPageComponents: ActionCreator<ThunkResult> =
  (routeDetails: EtoolsRouteDetails) => async (dispatch: Dispatch, getState: any) => {
    if (!routeDetails) {
      // invalid route => redirect to 404 page
      EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
      return;
    }

    const page = routeDetails.routeName;
    const subPage = routeDetails.subRouteName;
    const tab = routeDetails.params?.tab;

    dispatch(new GlobalLoadingUpdate('Loading...'));

    try {
      await import(`../../components/pages/${page}/${page}-page.ts`);

      if (subPage) {
        await import(`../../components/pages/${page}/${subPage}/${subPage}.ts`);

        if (tab) {
          await import(`../../components/pages/${page}/${subPage}/${tab}-tab/${tab}-tab.ts`);
        }
      }
    } catch (e) {
      console.log(e);
      console.log(`No file imports configuration found: page: ${page}, subpage: ${subPage}, tab: ${tab}!`);
      EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
    }

    if (page == 'activities-and-data-collection' && routeDetails.params?.tab == 'details') {
      waitForCondition(() => getState().staticData.users?.length > 0, 200).then(() =>
        dispatch(new GlobalLoadingUpdate(null))
      );
    } else {
      dispatch(new GlobalLoadingUpdate(null));
    }
    // add page details to redux store, to be used in other components
    dispatch(new UpdateStoreRouteDetails(routeDetails));
  };

export const navigate: ActionCreator<ThunkResult> = (path: string) => (dispatch: any) => {
  // Check if path matches a valid app route, use route details to load required page components

  // if app route is accessed, redirect to default route (if not already on it)
  if (path === Environment.basePath) {
    EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.DEFAULT));
    return;
  }

  // some routes need redirect to subRoute list
  const redirectPath: string | undefined = getRedirectToListPath(path);
  if (redirectPath) {
    EtoolsRouter.updateAppLocation(redirectPath);
    return;
  }

  const routeDetails: EtoolsRouteDetails | null = EtoolsRouter.getRouteDetails(path, true);

  /**
   * TODO:
   *  - create template page with detail about routing (including tabs subpages navigation), creating a new page
   */
  dispatch(loadPageComponents(routeDetails));
};
