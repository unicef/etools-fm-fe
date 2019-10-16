import { AnyAction, Reducer } from 'redux';
import { ActivityDetailsActions } from '../actions/activity-details.actions';

const INITIAL: IActivityDetailsState = {
    isRequest: {
        load: false,
        update: false
    },
    error: null,
    data: null
};

export const activityDetails: Reducer<IActivityDetailsState, any> = (state: IActivityDetailsState = INITIAL, action: AnyAction) => {
    switch (action.type) {
        case ActivityDetailsActions.ACTIVITY_DETAILS_GET_REQUEST: {
            return {
                ...state,
                isRequest: { ...state.isRequest, load: true },
                error: null
            };
        }
        case ActivityDetailsActions.ACTIVITY_DETAILS_GET_SUCCESS: {
            return {
                ...state,
                isRequest: { ...state.isRequest, load: false },
                data: action.payload,
                error: null
            };
        }
        case ActivityDetailsActions.ACTIVITY_DETAILS_GET_FAILURE: {
            return {
                ...state,
                isRequest: { ...state.isRequest, load: false },
                error: action.payload
            };
        }
        default:
            return state;
    }
};
