import { Reducer } from 'redux';
import { UserAction, UserActionTypes } from '../actions/user';

const INITIAL_USER_DATA: IUserState = {
    data: null,
    permissions: null
};

export const userData: Reducer<IUserState, any> = (state: IUserState = INITIAL_USER_DATA, action: UserAction) => {
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
        default:
            return state;
    }
};
