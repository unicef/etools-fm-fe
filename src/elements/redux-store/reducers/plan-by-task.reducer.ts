import {
    PlaningTasksActions, SET_INTERVENTION_LOCATIONS, SET_PARTNER_TASKS, SET_PARTNER_TASKS_LOADING_STATE, SET_TASKS_LIST,
    SET_TASKS_UPDATING_ERROR,
    START_TASKS_UPDATING,
    STOP_TASKS_UPDATING
} from '../actions/plan-by-task.actions';

const INITIAL = {
    updateInProcess: null,
    errors: {},
    partnerTasks: {
        loading: false,
        tasks: []
    },
    locationsList: null
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
        case SET_PARTNER_TASKS:
            const newState = Object.assign({}, state);
            newState.partnerTasks = Object.assign({}, newState.partnerTasks, {tasks: action.payload});
            return newState;
        case SET_PARTNER_TASKS_LOADING_STATE:
            const newTasksState = Object.assign({}, state);
            newTasksState.partnerTasks = Object.assign({}, newTasksState.partnerTasks, {loading: action.payload});
            return newTasksState;
        case SET_INTERVENTION_LOCATIONS:
            return Object.assign({}, state, {locationsList: action.payload});
        default:
            return state;
    }
}