import {
    FINISH_VISITS_REQUEST,
    SET_VISITS_ERRORS, SET_VISITS_LIST,
    START_VISITS_REQUEST,
    VisitsActions
} from '../actions/visits.actions';

const INITIAL = {
    list: { },
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
        default:
            return state;
    }
}
