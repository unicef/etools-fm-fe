import { Reducer } from 'redux';
import { CountryAction, CountryActionTypes } from '../actions/country.actions';

const INIT_COUNTRY_STATE: IRequestState = {
    isRequest: false,
    error: {}
};

export const country: Reducer<IRequestState, any> = (state: IRequestState = INIT_COUNTRY_STATE, action: CountryAction) => {
    switch (action.type) {
        case CountryActionTypes.START_CHANGE_COUNTRY:
            return {
                ...state,
                isRequest: true,
                error: null
            };
        case CountryActionTypes.FINISH_CHANGE_COUNTRY:
            return {
                ...state,
                isRequest: false,
                error: null
            };
        case CountryActionTypes.ERROR_CHANGE_COUNTRY:
            return {
                ...state,
                isRequest: false,
                error: action.error
            };
        default:
            return state;
    }
};
