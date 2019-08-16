import { AnyAction, Reducer } from 'redux';
import { UserActionTypes } from '../actions/user.actions';

const INITIAL_USER_DATA: IUserState = {
    data: null,
    permissions: null,
    isRequest: false,
    error: {}
};

export const user: Reducer<IUserState, any> = (state: IUserState = INITIAL_USER_DATA, action: AnyAction) => {
    switch (action.type) {
        case UserActionTypes.USER_DATA_REQUEST:
            return {
                ...state,
                isRequest: true,
                error: null
            };
        case UserActionTypes.USER_DATA_SUCCESS:
            return {
                ...state,
                isRequest: false,
                data: action.payload,
                error: null
            };
        case UserActionTypes.USER_DATA_FAILURE:
            return {
                ...state,
                isRequest: false,
                error: action.payload
            };
        default:
            return state;
    }
};
