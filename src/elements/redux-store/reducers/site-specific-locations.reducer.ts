import {
    SET_SITE_LOCATIONS_UPDATING_ERROR,
    SET_SPECIFIC_LOCATIONS_LIST,
    SiteLocationsActions,
    START_SITE_LOCATIONS_UPDATING,
    STOP_SITE_LOCATIONS_UPDATING
} from '../actions/site-specific-locations.actions';

const INITIAL = {
    updateInProcess: null,
    errors: {}
};

export function specificLocations(state = INITIAL, action: SiteLocationsActions) {
    switch (action.type) {
        case SET_SPECIFIC_LOCATIONS_LIST:
            return Object.assign({}, state, action.payload);
        case START_SITE_LOCATIONS_UPDATING:
            return Object.assign({}, state, {updateInProcess: true});
        case STOP_SITE_LOCATIONS_UPDATING:
            return Object.assign({}, state, {updateInProcess: false});
        case SET_SITE_LOCATIONS_UPDATING_ERROR:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}