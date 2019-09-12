import { AnyAction, Reducer } from 'redux';
import { CountryActionTypes } from '../actions/country.actions';

const INIT_COUNTRY_STATE: IRequestState = {
    isRequest: {
        get: false
    },
    error: {}
};

export const country: Reducer<IRequestState, any> = (state: IRequestState = INIT_COUNTRY_STATE, action: AnyAction) => {
    switch (action.type) {
        case CountryActionTypes.CHANGE_COUNTRY_REQUEST:
            return {
                ...state,
                isRequest: { ...state.isRequest, get: true },
                error: null
            };
        case CountryActionTypes.CHANGE_COUNTRY_SUCCESS:
            return {
                ...state,
                isRequest: { ...state.isRequest, get: false },
                error: null
            };
        case CountryActionTypes.CHANGE_COUNTRY_FAILURE:
            return {
                ...state,
                isRequest: { ...state.isRequest, get: false },
                error: action.payload
            };
        default:
            return state;
    }
};
