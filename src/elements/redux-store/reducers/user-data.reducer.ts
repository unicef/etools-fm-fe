import { ADD_USER_DATA, AddUserData } from '../actions/user-data.actions';

const INITIAL: IUserProfile | null = null;

export function userData(state = INITIAL, action: AddUserData) {
    switch (action.type) {
        case ADD_USER_DATA:
            return state ? state : action.payload;
        default:
            return state;
    }
}
