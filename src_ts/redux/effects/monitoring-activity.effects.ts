import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {
  GEOGRAPHIC_COVERAGE,
  HACT_VISITS,
  MONITORING_ACTIVITY_CP_OUTPUT_COVERAGE,
  MONITORING_ACTIVITY_INTERVENTIONS_COVERAGE,
  MONITORING_ACTIVITY_OVERALL_STATISTICS,
  MONITORING_ACTIVITY_PARTNERS_COVERAGE,
  OPEN_ISSUES_CP_OUTPUT,
  OPEN_ISSUES_LOCATIONS,
  OPEN_ISSUES_PARTNERS, SECTIONS,
} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {
  SetCpOutputCoverage,
  SetGeographicCoverage,
  SetHactVisits,
  SetInterventionsCoverage,
  SetOpenIssuesCpOutput,
  SetOpenIssuesLocation,
  SetOpenIssuesPartnership,
  SetOverallActivities,
  SetPartnersCoverage, SetSections,
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
      dispatch(new SetCpOutputCoverage(response));
    });
  };
}

export function loadSections(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(SECTIONS);
    return request<EtoolsSection[]>(endpoint.url, {method: 'GET'}).then((response: EtoolsSection[]) => {
      dispatch(new SetSections(response));
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

export function loadHactVisits(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(HACT_VISITS);
    return request<HactVisits[]>(endpoint.url, {method: 'GET'}).then((response: HactVisits[]) => {
      dispatch(new SetHactVisits(response));
    });
  };
}
