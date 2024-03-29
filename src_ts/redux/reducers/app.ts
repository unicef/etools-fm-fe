import {Reducer} from 'redux';
import {AppAction, AppActionTypes} from '../actions/app.actions';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

const INITIAL_STATE: IAppState = {
  routeDetails: {} as EtoolsRouteDetails,
  previousRoute: null,
  drawerOpened: false
};

const app: Reducer<IAppState, any> = (state: IAppState = INITIAL_STATE, action: AppAction) => {
  switch (action.type) {
    case AppActionTypes.UPDATE_ROUTE_DETAILS:
      return {
        ...state,
        routeDetails: action.routeDetails
      };
    case AppActionTypes.UPDATE_QUERY_PARAMS:
      const routeDetails: EtoolsRouteDetails = {...state.routeDetails, queryParams: action.queryParams};
      return {
        ...state,
        routeDetails
      };
    case AppActionTypes.UPDATE_DRAWER_STATE:
      return {
        ...state,
        drawerOpened: action.opened
      };
    case AppActionTypes.SAVE_ROUTE:
      return {
        ...state,
        previousRoute: action.previousRoute
      };
    default:
      return state;
  }
};

export default app;
