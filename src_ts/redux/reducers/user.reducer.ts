import { Reducer } from 'redux';
import { UserAction, UserActionTypes } from '../actions/user.actions';

const INITIAL_USER_DATA: IUserState = {
    data: null,
    permissions: null,
    isRequest: false,
    error: {}
};

export const user: Reducer<IUserState, any> = (state: IUserState = INITIAL_USER_DATA, action: UserAction) => {
    switch (action.type) {
        case UserActionTypes.UPDATE_USER_DATA:
            return {
                ...state,
                data: action.data
            };
        case UserActionTypes.UPDATE_USER_PERMISSIONS:
            return {
                ...state,
                permissions: action.permissions
            };
        case UserActionTypes.START_UPDATE_USER_DATA:
            return {
                ...state,
                isRequest: true,
                error: null
            };
        case UserActionTypes.FINISH_UPDATE_USER_DATA:
            return {
                ...state,
                isRequest: false,
                error: null
            };
        case UserActionTypes.ERROR_UPDATE_USER_DATA:
            return {
                ...state,
                isRequest: false,
                error: action.error
            };
        default:
            return state;
    }
};
