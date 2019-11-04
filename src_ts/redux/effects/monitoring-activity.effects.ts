import { Dispatch } from 'redux';
import { getEndpoint } from '../../endpoints/endpoints';
import {
  MONITORING_ACTIVITY_CP_OUTPUT_COVERAGE,
  MONITORING_ACTIVITY_INTERVENTIONS_COVERAGE,
  MONITORING_ACTIVITY_OVERALL_STATISTICS,
  MONITORING_ACTIVITY_PARTNERS_COVERAGE
} from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';
import {
  SetCpOutpurCoverage,
  SetInterventionsCoverage,
  SetOverallActivities,
  SetPartnersCoverage
} from '../actions/monitoring-activity.actions';

export function loadOverallStatistics(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(MONITORING_ACTIVITY_OVERALL_STATISTICS);
    return request<OverallActivities>(endpoint.url, { method: 'GET' })
        .then((response: OverallActivities) => { dispatch(new SetOverallActivities(response)); });
  };
}

export function loadPartnersCoverage(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(MONITORING_ACTIVITY_PARTNERS_COVERAGE);
    return request<PartnersCoverage>(endpoint.url, { method: 'GET' })
        .then((response: PartnersCoverage) => { dispatch(new SetPartnersCoverage(response)); });
  };
}

export function loadInterventionsCoverage(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(MONITORING_ACTIVITY_INTERVENTIONS_COVERAGE);
    return request<InterventionsCoverage>(endpoint.url, { method: 'GET' })
        .then((response: InterventionsCoverage) => { dispatch(new SetInterventionsCoverage(response)); });
  };
}

export function loadCpOutputCoverage(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(MONITORING_ACTIVITY_CP_OUTPUT_COVERAGE);
    return request<CpOutputCoverage>(endpoint.url, { method: 'GET' })
        .then((response: CpOutputCoverage) => { dispatch(new SetCpOutpurCoverage(response)); });
  };
}
