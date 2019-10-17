import { WidgetLocationsActions, WidgetLocationsActionTypes } from '../actions/widget-locations.actions';
import { Reducer } from 'redux';

const INITIAL_STATE: IWidgetLocationsState = {
    loading: null,
    data: {},
    pathLoading: null,
    pathCollection: {}
};
export const widgetLocations: Reducer<IWidgetLocationsState, any> = (state: IWidgetLocationsState = INITIAL_STATE, action: WidgetLocationsActions) => {
    switch (action.type) {
        case WidgetLocationsActionTypes.SAVE_WIDGET_LOCATIONS_LIST:
            const data: WidgetStoreData = { ...state.data, [action.requestParams]: action.widgetLocations };
            return { ...state, data };
        case WidgetLocationsActionTypes.SAVE_LOCATION_PATH:
            const pathCollection: WidgetStoreData = {
                ...state.pathCollection,
                [action.locationId]: action.locationPath
            };
            return { ...state, pathCollection };
        case WidgetLocationsActionTypes.SET_WIDGET_LOCATIONS_LOADING:
            return { ...state, loading: action.payload };
        case WidgetLocationsActionTypes.SET_LOCATION_PATH_LOADING:
            return { ...state, pathLoading: action.payload };
        default:
            return state;
    }
};
