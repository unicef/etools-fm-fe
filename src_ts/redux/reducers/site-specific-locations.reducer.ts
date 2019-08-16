import {
    SiteLocationsActions,
    SitesActionsTypes
} from '../actions/site-specific-locations.actions';
import { Reducer } from 'redux';

const INITIAL: ISpecificLocationsState = {
    updateInProcess: null,
    errors: null,
    data: null
};

export const specificLocations: Reducer<ISpecificLocationsState> = (state: ISpecificLocationsState = INITIAL, action: SiteLocationsActions) => {
    switch (action.type) {
        case SitesActionsTypes.SET_SPECIFIC_LOCATIONS_LIST:
            return Object.assign({}, state, { data: action.payload });
        case SitesActionsTypes.START_SITE_LOCATIONS_UPDATING:
            return Object.assign({}, state, { updateInProcess: true });
        case SitesActionsTypes.STOP_SITE_LOCATIONS_UPDATING:
            return Object.assign({}, state, { updateInProcess: false });
        case SitesActionsTypes.SET_SITE_LOCATIONS_UPDATING_ERROR:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
};
