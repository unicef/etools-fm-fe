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

const importSubRoutes = (subRouteName: string | null): void => {
  if (!subRouteName) {
    return;
  }
  switch (subRouteName) {
    case 'activities_item':
      import('../../components/pages/activities-and-data-collection/activity-item/activity-item.js');
      import('../../components/pages/activities-and-data-collection/activity-item/details-tab/activity-details-tab.js');
      import('../../components/pages/activities-and-data-collection/activity-item/review-tab/activity-review-tab.js');
      import(
        '../../components/pages/activities-and-data-collection/activity-item/checklist-tab/activity-checklist-tab.js'
      );
      import(
        '../../components/pages/activities-and-data-collection/activity-item/data-collect-tab/data-collect-tab.js'
      );
      import(
        '../../components/pages/activities-and-data-collection/activity-item/additional-info-tab/additional-info-tab.js'
      );
      import(
        '../../components/pages/activities-and-data-collection/activity-item/activity-summary-tab/activity-summary-tab.js'
      );
      import(
        '../../components/pages/activities-and-data-collection/activity-item/activity-attachments-tab/activity-attachments-tab.js'
      );
      import(
        '../../components/pages/activities-and-data-collection/activity-item/action-points-tab/action-points-tab.js'
      );

      break;
    case 'analyze_monitoring-activity':
      import('../../components/pages/analyze/monitoring-tab/monitoring-tab.js');
      import('../../components/pages/analyze/monitoring-tab/coverage/partnership-tab/partnership-tab.js');
      import('../../components/pages/analyze/monitoring-tab/coverage/pd-spd-tab/pd-spd-tab.js');
      import('../../components/pages/analyze/monitoring-tab/coverage/cp-output-tab/cp-output-tab.js');
      import(
        '../../components/pages/analyze/monitoring-tab/open-issues-action-points/open-issues-partnership-tab/open-issues-partnership-tab.js'
      );
      import(
        '../../components/pages/analyze/monitoring-tab/open-issues-action-points/open-issues-cp-output-tab/open-issues-cp-output-tab.js'
      );
      import(
        '../../components/pages/analyze/monitoring-tab/open-issues-action-points/open-issues-location-tab/open-issues-location-tab.js'
      );
      break;
    case 'analyze_country-overview':
      import('../../components/pages/analyze/co-overview-tab/co-overview-tab.js');
      import('../../components/pages/analyze/co-overview-tab/cp-details-item/cp-details-item.js');
      break;
    case 'partners_item':
      import('../../components/pages/partners/details/details-tab/partner-details-tab.js');
      import('../../components/pages/partners/details/attachements-tab/partner-attachments-tab.js');
      break;
    default:
      console.log(`No file imports configuration found agreements: ${subRouteName} (componentsLazyLoadConfig)!`);
      EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
      break;
  }
};

const loadPageComponents: ActionCreator<ThunkResult> =
  (routeDetails: EtoolsRouteDetails) => (dispatch: Dispatch, getState: any) => {
    if (!routeDetails) {
      // invalid route => redirect to 404 page
      EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
      return;
    }
    let routeImportsPathsKey: string = routeDetails.routeName;
    if (routeDetails.subRouteName) {
      routeImportsPathsKey += `_${routeDetails.subRouteName}`;
    }
    dispatch(new GlobalLoadingUpdate('Loading...'));
    if (routeImportsPathsKey === 'page-not-found') {
      import('../../components/pages/page-not-found.js');
    } else {
      switch (routeImportsPathsKey) {
        case 'management_sites':
          import('../../components/pages/management/management-page.js')
            .then(() => import('../../components/pages/management/sites-tab/sites-tab.js'))
            .catch((err) => {
              console.log(err);
              EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND));
            });
          break;
        case 'management_rationale':
          import('../../components/pages/management/management-page.js')
            .then(() => import('../../components/pages/management/rationale-tab/rationale-tab.js'))
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'templates_questions':
          import('../../components/pages/templates/templates-page.js')
            .then(() => import('../../components/pages/templates/questions-tab/questions-tab.js'))
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'templates_issue-tracker':
          import('../../components/pages/templates/templates-page.js')
            .then(() => import('../../components/pages/templates/issue-tracker-tab/issue-tracker-tab.js'))
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'templates_templates':
          import('../../components/pages/templates/templates-page.js')
            .then(() => import('../../components/pages/templates/templates-tab/templates-tab.js'))
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'activities_list':
          import('../../components/pages/activities-and-data-collection/activities-page.js')
            .then(
              () => import('../../components/pages/activities-and-data-collection/activities-list/activities-list.js')
            )
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'activities_item':
          import('../../components/pages/activities-and-data-collection/activities-page.js')
            .then(() => importSubRoutes(routeImportsPathsKey))
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'activities_data-collection':
          import('../../components/pages/activities-and-data-collection/activities-page.js')
            .then(
              () => import('../../components/pages/activities-and-data-collection/data-collection/data-collection.js')
            )
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'analyze_monitoring-activity':
          import('../../components/pages/analyze/analyze-page.js')
            .then(() => importSubRoutes(routeImportsPathsKey))
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'analyze_country-overview':
          import('../../components/pages/analyze/analyze-page.js')
            .then(() => importSubRoutes(routeImportsPathsKey))
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'partners_list':
          import('../../components/pages/partners/partners-page.js')
            .then(() => import('../../components/pages/partners/list/partners-list.js'))
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
        case 'partners_item':
          import('../../components/pages/partners/details/partner-details.js')
            .then(() => importSubRoutes(routeImportsPathsKey))
            .catch(() => EtoolsRouter.updateAppLocation(EtoolsRouter.getRedirectPath(EtoolsRedirectPath.NOT_FOUND)));
          break;
      }
    }
    if (routeDetails.routeName == 'activities' && routeDetails.params?.tab == 'details') {
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
