import {
    SET_METHOD_TYPE_UPDATING_ERROR,
    SET_METHOD_TYPES_LIST, SettingsMethodTypesActions,
    START_METHOD_TYPE_UPDATING, STOP_METHOD_TYPE_UPDATING
} from '../actions/settings-method-types.actions';

const INITIAL = {
    updateInProcess: null,
    errors: {}
};

export function methodTypes(state = INITIAL, action: SettingsMethodTypesActions) {
    switch (action.type) {
        case SET_METHOD_TYPES_LIST:
            return Object.assign({}, state, action.payload);
        case START_METHOD_TYPE_UPDATING:
            return Object.assign({}, state, {updateInProcess: true});
        case STOP_METHOD_TYPE_UPDATING:
            return Object.assign({}, state, {updateInProcess: false});
        case SET_METHOD_TYPE_UPDATING_ERROR:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}
