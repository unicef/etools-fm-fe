import {
    ADD_NOTIFICATION, NotificationActions,
    REMOVE_NOTIFICATION,
    RESET_NOTIFICATIONS
} from '../actions/notification.actions';

const INITIAL: Toast[] = [];

export function notifications(state = INITIAL, action: NotificationActions): Toast[] {
    switch (action.type) {
        case ADD_NOTIFICATION:
            // @ts-ignore
            const id = _.uniqueId('toast');
            const notification: Toast = {id, text: action.payload};
            return [...state, notification];
        case REMOVE_NOTIFICATION:
            const index = state.findIndex(nf => nf.id === action.payload);
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
