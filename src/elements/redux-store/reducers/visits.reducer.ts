import {
    FINISH_VISITS_REQUEST, SET_PLANNED_TOTAL_INFO,
    SET_VISITS_ERRORS, SET_VISITS_LIST, SET_VISITS_TOTAL_INFO,
    START_VISITS_REQUEST,
    VisitsActions
} from '../actions/visits.actions';

const INITIAL = {
    list: { },
    totalInfo: null,
    totalInfoPlanned: null,
    requestInProcess: null,
    errors: {}
};

export function visitsData(state = INITIAL, action: VisitsActions) {
    switch (action.type) {
        case SET_VISITS_LIST:
            const listState = Object.assign({}, state.list, action.payload);
            return Object.assign({}, state, {list: listState});
        case START_VISITS_REQUEST:
            return Object.assign({}, state, {requestInProcess: true});
        case FINISH_VISITS_REQUEST:
            return Object.assign({}, state, {requestInProcess: false});
        case SET_VISITS_ERRORS:
            return Object.assign({}, state, action.payload);
        case SET_VISITS_TOTAL_INFO:
            return Object.assign({}, state, {totalInfo: action.payload});
        case SET_PLANNED_TOTAL_INFO:
            return Object.assign({}, state, {totalInfoPlanned: action.payload});
        default:
            return state;
    }
}
