import { Reducer } from 'redux';
import { AppAction, AppActionTypes } from '../actions/app';

const INITIAL_STATE: IAppState = {
    routeDetails: {} as IRouteDetails,
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
            const routeDetails: IRouteDetails = { ...state.routeDetails, queryParams: action.queryParams };
            return {
                ...state,
                routeDetails
            };
        case AppActionTypes.UPDATE_DRAWER_STATE:
            return {
                ...state,
                drawerOpened: action.opened
            };
        default:
            return state;
    }
};

export default app;
