import { CpOutputsActions, SET_CP_OUTPUTS } from '../actions/cp-outputs.actions';

export function cpOutputs(state = {}, action: CpOutputsActions) {
    switch (action.type) {
        case SET_CP_OUTPUTS:
            return {
                ...action.payload
            };
        default:
            return state;
    }
}
