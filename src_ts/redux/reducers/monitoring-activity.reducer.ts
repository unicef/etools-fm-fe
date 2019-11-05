import { Reducer } from 'redux';
import { MonitoringActivityActions, MonitoringActivityActionTypes } from '../actions/monitoring-activity.actions';

const INITIAL_STATE: IMonitoringActivityState = {
    overallActivities: {
        visits_completed: 0,
        visits_planned: 0
    },
    partnersCoverage: [],
    interventionsCoverage: [],
    cpOutputCoverage: []
};

export const monitoringActivities: Reducer<IMonitoringActivityState, any> = (state: IMonitoringActivityState = INITIAL_STATE, action: MonitoringActivityActions) => {
    switch (action.type) {
        case MonitoringActivityActionTypes.SET_OVERALL_ACTIVITIES:
            return { ...state, overallActivities: action.payload };
        case MonitoringActivityActionTypes.SET_PARTNERS_COVERAGE:
            return { ...state, partnersCoverage: action.payload };
        case MonitoringActivityActionTypes.SET_INTERVENTIONS_COVERAGE:
            return { ...state, interventionsCoverage: action.payload };
        case MonitoringActivityActionTypes.SET_CP_OUTPUT_COVERAGE:
            return { ...state, cpOutputCoverage: action.payload };
        default:
            return state;
    }
};
