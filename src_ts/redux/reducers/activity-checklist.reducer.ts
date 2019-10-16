import { Reducer } from 'redux';
import { ActivityChecklistActions, ActivityChecklistActionTypes } from '../actions/activity-checklist.actions';

const INITIAL_STATE: IActivityChecklistState = {
    data: null,
    editedCard: null
};

export const activityChecklist: Reducer<IActivityChecklistState, any> = (state: IActivityChecklistState = INITIAL_STATE, action: ActivityChecklistActions) => {
    switch (action.type) {
        case ActivityChecklistActionTypes.SET_ACTIVITY_CHECKLIST:
            return { ...state, data: action.payload };
        case ActivityChecklistActionTypes.SET_EDITED_CHECKLIST_CARD:
            return { ...state, editedCard: action.payload };
        default:
            return state;
    }
};
