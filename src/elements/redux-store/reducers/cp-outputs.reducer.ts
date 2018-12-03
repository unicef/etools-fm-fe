import {
    CpOutputsActions,
    FINISH_REQUEST_CP_OUTPUT,
    SET_CP_OUTPUTS,
    SET_ERROR_CP_OUTPUT,
    START_REQUEST_CP_OUTPUT
} from '../actions/cp-outputs.actions';

const INITIAL = {
    requestInProcess: null,
    errors: {}
};

export function cpOutputs(state = INITIAL, action: CpOutputsActions) {
    switch (action.type) {
        case SET_CP_OUTPUTS:
            return Object.assign({}, state, action.payload);
        case START_REQUEST_CP_OUTPUT:
            return Object.assign({}, state, {requestInProcess: true});
        case FINISH_REQUEST_CP_OUTPUT:
            return Object.assign({}, state, {requestInProcess: false});
        case SET_ERROR_CP_OUTPUT:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}
