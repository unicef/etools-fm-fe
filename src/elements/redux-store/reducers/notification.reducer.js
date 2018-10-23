import { ADD_NOTIFICATION,
    REMOVE_NOTIFICATION,
    RESET_NOTIFICATIONS } from '../actions/notification.actions';

const INITIAL = [];

export function notifications(state = INITIAL, action) {
    switch (action.type) {
        case ADD_NOTIFICATION:
            const id = _.uniqueId('toast');
            const notification = {id, text: action.payload};
            return [...state, notification];
        case REMOVE_NOTIFICATION:
            const index = state.findIndex(notification => notification.id === action.payload);
            if (index > -1) {
                state.splice(index, 1);
            }
            return [...state];
        case RESET_NOTIFICATIONS:
            return [];
        default:
            return state;
    }
}
