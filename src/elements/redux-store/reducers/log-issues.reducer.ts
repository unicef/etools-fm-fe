import {
    FINISH_REQUEST_LOG_ISSUES,
    LogIssuesActions,
    SET_ERROR_LOG_ISSUES,
    SET_LOG_ISSUES,
    START_REQUEST_LOG_ISSUES
} from '../actions/log-issues.actions';

const INITIAL = {
    requestInProcess: null,
    errors: {}
};

export function logIssues(state = INITIAL, action: LogIssuesActions) {
    switch (action.type) {
        case SET_LOG_ISSUES:
            return Object.assign({}, state, action.payload);
        case START_REQUEST_LOG_ISSUES:
            return Object.assign({}, state, {requestInProcess: true});
        case FINISH_REQUEST_LOG_ISSUES:
            return Object.assign({}, state, {requestInProcess: false});
        case SET_ERROR_LOG_ISSUES:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}
