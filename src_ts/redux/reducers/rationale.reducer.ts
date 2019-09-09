import { Reducer } from 'redux';
import { RationaleActionTypes, Rationalections } from '../actions/rationale.actions';

const INITIAL_STATE: IRationaleState = {
    error: {},
    data: null,
    updateInProcess: null
};

export const rationale: Reducer<IRationaleState, any> = (state: IRationaleState = INITIAL_STATE, action: Rationalections) => {
    switch (action.type) {
        case RationaleActionTypes.SET_RATIONALE:
            return { ...state, data: action.payload };
        case RationaleActionTypes.SET_RATIONALE_UPDATE_STATE:
            return { ...state, updateInProcess: action.payload };
        case RationaleActionTypes.SET_RATIONALE_UPDATE_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
