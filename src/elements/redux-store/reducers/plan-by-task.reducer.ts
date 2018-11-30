import {
    PlaningTasksActions, SET_TASKS_LIST,
    SET_TASKS_UPDATING_ERROR,
    START_TASKS_UPDATING,
    STOP_TASKS_UPDATING
} from '../actions/plan-by-task.actions';

const INITIAL = {
    updateInProcess: null,
    errors: {}
};

export function planingTasks(state = INITIAL, action: PlaningTasksActions) {
    switch (action.type) {
        case SET_TASKS_LIST:
            return Object.assign({}, state, action.payload);
        case START_TASKS_UPDATING:
            return Object.assign({}, state, {updateInProcess: true});
        case STOP_TASKS_UPDATING:
            return Object.assign({}, state, {updateInProcess: false});
        case SET_TASKS_UPDATING_ERROR:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}