import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {
  GEOGRAPHIC_COVERAGE,
  MONITORING_ACTIVITY_CP_OUTPUT_COVERAGE,
  MONITORING_ACTIVITY_INTERVENTIONS_COVERAGE,
  MONITORING_ACTIVITY_OVERALL_STATISTICS,
  MONITORING_ACTIVITY_PARTNERS_COVERAGE,
  OPEN_ISSUES_CP_OUTPUT,
  OPEN_ISSUES_LOCATIONS,
  OPEN_ISSUES_PARTNERS
} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {
  SetCpOutpurCoverage,
  SetGeographicCoverage,
  SetInterventionsCoverage, SetOpenIssuesCpOutput, SetOpenIssuesLocation,
  SetOpenIssuesPartnership,
  SetOverallActivities,
  SetPartnersCoverage,
} from '../actions/monitoring-activity.actions';

export function loadOverallStatistics(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(MONITORING_ACTIVITY_OVERALL_STATISTICS);
    return request<OverallActivities>(endpoint.url, {method: 'GET'}).then((response: OverallActivities) => {
      dispatch(new SetOverallActivities(response));
    });
  };
}

export function loadPartnersCoverage(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(MONITORING_ACTIVITY_PARTNERS_COVERAGE);
    return request<PartnersCoverage[]>(endpoint.url, {method: 'GET'}).then((response: PartnersCoverage[]) => {
      dispatch(new SetPartnersCoverage(response));
    });
  };
}

export function loadInterventionsCoverage(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(MONITORING_ACTIVITY_INTERVENTIONS_COVERAGE);
    return request<InterventionsCoverage[]>(endpoint.url, {method: 'GET'}).then((response: InterventionsCoverage[]) => {
      dispatch(new SetInterventionsCoverage(response));
    });
  };
}

export function loadCpOutputCoverage(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(MONITORING_ACTIVITY_CP_OUTPUT_COVERAGE);
    return request<CpOutputCoverage[]>(endpoint.url, {method: 'GET'}).then((response: CpOutputCoverage[]) => {
      dispatch(new SetCpOutpurCoverage(response));
    });
  };
}

export function loadGeographicCoverageBySection(section: string): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(GEOGRAPHIC_COVERAGE);
    endpoint.url += section;
    return request<GeographicCoverage[]>(endpoint.url, {method: 'GET'}).then((response: GeographicCoverage[]) => {
      dispatch(new SetGeographicCoverage(response));
    });
  };
}

export function loadOpenIssuesPartnership(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(OPEN_ISSUES_PARTNERS);
    return request<OpenIssuesActionPoints[]>(endpoint.url, {method: 'GET'}).then(
      (response: OpenIssuesActionPoints[]) => {
        dispatch(new SetOpenIssuesPartnership(response));
      }
    );
  };
}

export function loadOpenIssuesCpOutput(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(OPEN_ISSUES_CP_OUTPUT);
    return request<OpenIssuesActionPoints[]>(endpoint.url, {method: 'GET'}).then(
      (response: OpenIssuesActionPoints[]) => {
        dispatch(new SetOpenIssuesCpOutput(response));
      }
    );
  };
}

export function loadOpenIssuesLocations(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(OPEN_ISSUES_LOCATIONS);
    return request<OpenIssuesActionPoints[]>(endpoint.url, {method: 'GET'}).then(
      (response: OpenIssuesActionPoints[]) => {
        dispatch(new SetOpenIssuesLocation(response));
      }
    );
  };
}
