import { SET_CP_OUTPUTS } from '../actions/cp-outputs.actions';

export function cpOutputs(state = {}, action: {type: string, payload: ListData}) {
    switch (action.type) {
        case SET_CP_OUTPUTS:
            const payload = action.payload;
            return {
                ...state,
                results: payload.results,
                count: payload.count
            };
        default:
            return state;
    }
}
