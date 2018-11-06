import { SET_METHOD_TYPES_LIST, SetMethodTypesList } from '../actions/settings-method-types.actions';

const INITIAL = {};

export function methodTypes(state = INITIAL, action: SetMethodTypesList) {
    switch (action.type) {
        case SET_METHOD_TYPES_LIST:
            return {
                ...action.payload
            };
        default:
            return state;
    }
}