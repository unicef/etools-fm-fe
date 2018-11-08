import { SET_SPECIFIC_LOCATIONS_LIST, SetSpecificLocatinos } from '../actions/site-specific-locations.actions';

const INITIAL = {};

export function specificLocations(state = INITIAL, action: SetSpecificLocatinos) {
    switch (action.type) {
        case SET_SPECIFIC_LOCATIONS_LIST:
            return {
                ...action.payload
            };
        default:
            return state;
    }
}