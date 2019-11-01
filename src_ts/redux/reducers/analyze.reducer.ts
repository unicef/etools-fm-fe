import { Reducer } from 'redux';
import { AnalyzeActions, AnalyzeActionTypes } from '../actions/analyze.actions';

const INITIAL_STATE: IAnalyzeState = {
    overallActivities: {
        visits_completed: 13,
        visits_planned: 26
    }
};

export const analyzeActivities: Reducer<IAnalyzeState, any> = (state: IAnalyzeState = INITIAL_STATE, action: AnalyzeActions) => {
    switch (action.type) {
        case AnalyzeActionTypes.SET_OVERALL_ACTIVITIES: return { ...state, overallActivities: action.payload };
        default: return state;
    }
}
