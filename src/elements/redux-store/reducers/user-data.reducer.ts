import { ADD_USER_DATA } from '../actions/user-data.actions';

const INITIAL = null;

export function userData(state = INITIAL, action) {
    switch (action.type) {
        case ADD_USER_DATA:
            return state ? state : action.payload;
        default:
            return state;
    }
}
