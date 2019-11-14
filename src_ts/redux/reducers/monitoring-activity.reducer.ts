import {Reducer} from 'redux';
import {MonitoringActivityActions, MonitoringActivityActionTypes} from '../actions/monitoring-activity.actions';

const PARTNER_TAB: string = 'partner';

const INITIAL_STATE: IMonitoringActivityState = {
  overallActivities: {
    visits_completed: 0,
    visits_planned: 0
  },
  partnersCoverage: [],
  interventionsCoverage: [],
  cpOutputCoverage: [],
  sections: [],
  geographicCoverage: [],
  openIssuesPartnership: [],
  openIssuesCpOutput: [],
  openIssuesLocation: [],
  lastActivatedTab: PARTNER_TAB,
  hactVisits: []
};

export const monitoringActivities: Reducer<IMonitoringActivityState, any> = (
  state: IMonitoringActivityState = INITIAL_STATE,
  action: MonitoringActivityActions
) => {
  switch (action.type) {
    case MonitoringActivityActionTypes.SET_OVERALL_ACTIVITIES:
      return {...state, overallActivities: action.payload};
    case MonitoringActivityActionTypes.SET_PARTNERS_COVERAGE:
      return {...state, partnersCoverage: action.payload};
    case MonitoringActivityActionTypes.SET_INTERVENTIONS_COVERAGE:
      return {...state, interventionsCoverage: action.payload};
    case MonitoringActivityActionTypes.SET_CP_OUTPUT_COVERAGE:
      return {...state, cpOutputCoverage: action.payload};
    case MonitoringActivityActionTypes.SET_SECTIONS:
      return {...state, sections: action.payload};
    case MonitoringActivityActionTypes.SET_GEOGRAPHIC_COVERAGE:
      return {...state, geographicCoverage: action.payload};
    case MonitoringActivityActionTypes.SET_OPEN_ISSUES_PARTNERSHIP:
      return {...state, openIssuesPartnership: action.payload};
    case MonitoringActivityActionTypes.SET_OPEN_ISSUES_CP_OUTPUT:
      return {...state, openIssuesCpOutput: action.payload};
    case MonitoringActivityActionTypes.SET_OPEN_ISSUES_LOCATION:
      return {...state, openIssuesLocation: action.payload};
    case MonitoringActivityActionTypes.SWITCH_TAB:
      return {...state, lastActivatedTab: action.payload};
    case MonitoringActivityActionTypes.SET_HACT_VISITS:
      return {...state, hactVisits: action.payload};
    default:
      return state;
  }
};
