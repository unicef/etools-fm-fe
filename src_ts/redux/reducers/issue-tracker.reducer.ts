import { AnyAction, Reducer } from 'redux';
import { IssueTrackerActions } from '../actions/issue-tracker.actions';

const INITIAL: IIssueTrackerState = {
    isRequest: {
        load: false,
        update: false
    },
    error: null,
    data: null
};

export const issueTracker: Reducer<IIssueTrackerState, any> = (state: IIssueTrackerState = INITIAL, action: AnyAction) => {
    switch (action.type) {
        case IssueTrackerActions.ISSUE_TRACKER_DATA_REQUEST:
            return {
                ...state,
                isRequest: { ...state.isRequest, load: true },
                error: null
            };
        case IssueTrackerActions.ISSUE_TRACKER_DATA_SUCCESS:
            return {
                ...state,
                isRequest: { ...state.isRequest, load: false },
                data: action.payload,
                error: null
            };
        case IssueTrackerActions.ISSUE_TRACKER_DATA_FAILURE:
            return {
                ...state,
                isRequest: { ...state.isRequest, load: false },
                error: action.payload
            };
        case IssueTrackerActions.ISSUE_TRACKER_UPDATE_REQUEST:
            return {
                ...state,
                isRequest: { ...state.isRequest, update: true },
                error: null
            };
        case IssueTrackerActions.ISSUE_TRACKER_UPDATE_SUCCESS:
            return {
                ...state,
                isRequest: { ...state.isRequest, update: false },
                error: null
            };
        case IssueTrackerActions.ISSUE_TRACKER_UPDATE_FAILURE:
            return {
                ...state,
                isRequest: { ...state.isRequest, update: false },
                error: action.payload
            };
        default:
            return state;
    }
};
