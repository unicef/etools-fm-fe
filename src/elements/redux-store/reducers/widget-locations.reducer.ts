import {
    SAVE_LOCATION_PATH,
    SAVE_WIDGET_LOCATIONS_LIST, START_LOCATION_PATH_LOADING,
    START_WIDGET_LOCATIONS_LOADING, STOP_LOCATION_PATH_LOADING, STOP_WIDGET_LOCATIONS_LOADING,
    WidgetLocationsActions
} from '../actions/widget-locations.actions';

const INITIAL = {
    loading: null,
    data: {},
    pathLoading: null,
    pathCollection: {}
};

export function widgetLocationsStore(state = INITIAL, action: WidgetLocationsActions) {
    switch (action.type) {
        case SAVE_WIDGET_LOCATIONS_LIST:
            const data = Object.assign({}, state.data, {[action.requestParams]: action.widgetLocations});
            return Object.assign({}, state, {data});
        case START_WIDGET_LOCATIONS_LOADING:
            return Object.assign({}, state, {loading: true});
        case STOP_WIDGET_LOCATIONS_LOADING:
            return Object.assign({}, state, {loading: false});
        case START_LOCATION_PATH_LOADING:
            return Object.assign({}, state, {pathLoading: true});
        case STOP_LOCATION_PATH_LOADING:
            return Object.assign({}, state, {pathLoading: false});
        case SAVE_LOCATION_PATH:
            const pathCollection = Object.assign({}, state.pathCollection, {[action.locationId]: action.locationPath});
            return Object.assign({}, state, {pathCollection});
        default:
            return state;
    }
}
