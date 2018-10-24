import { LoadingActions, RUN_GLOBAL_LOADING, STOP_GLOBAL_LOADING } from '../actions/global-loading.actions';

const INITIAL: LoadingData[] = [];

export function globalLoading(state = INITIAL, action: LoadingActions) {
    const {type: loadingType} = action.payload || {type: ''};
    switch (action.type) {
        case RUN_GLOBAL_LOADING:
            const exists = state.find(loading => loading.type === loadingType);
            if (exists) {
                console.warn(`Global loading with type "${loadingType}" is in process already.
                Current call will be ignored`);
                return state;
            }
            return [...state, action.payload];
        case STOP_GLOBAL_LOADING:
            const index = state.findIndex(loading => loading.type === loadingType);
            if (!~index) { return state; }
            state.splice(index, 1);
            return [...state];

        default:
            return state;
    }
}
