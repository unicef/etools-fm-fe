export enum MonitoringActivityActionTypes {
  SET_OVERALL_ACTIVITIES = '[Monitoring activity Action]: SET_OVERALL_ACTIVITIES',
  SET_PARTNERS_COVERAGE = '[Monitoring activity Action]: SET_PARTNERS_COVERAGE',
  SET_INTERVENTIONS_COVERAGE = '[Monitoring activity Action]: SET_INTERVENTIONS_COVERAGE',
  SET_CP_OUTPUT_COVERAGE = '[Monitoring activity Action]: SET_CP_OUTPUT_COVERAGE',
  SET_SECTIONS = '[Monitoring activity Action]: SET_SECTIONS',
  SET_GEOGRAPHIC_COVERAGE = '[Monitoring activity Action]: SET_GEOGRAPHIC_COVERAGE',
  SET_OPEN_ISSUES_PARTNERSHIP = '[Monitoring activity Action]: SET_OPEN_ISSUES_PARTNERSHIP',
  SET_OPEN_ISSUES_CP_OUTPUT = '[Monitoring activity Action]: SET_OPEN_ISSUES_CP_OUTPUT',
  SET_OPEN_ISSUES_LOCATION = '[Monitoring activity Action]: SET_OPEN_ISSUES_LOCATION',
  SWITCH_TAB = '[Monitoring activity Action]: SWITCH_TAB',
  SET_HACT_VISITS = '[Monitoring activity Action]: SET_HACT_VISITS'
}

export class SetOverallActivities {
  readonly type: MonitoringActivityActionTypes.SET_OVERALL_ACTIVITIES =
    MonitoringActivityActionTypes.SET_OVERALL_ACTIVITIES;
  constructor(public payload: OverallActivities) {}
}

export class SetPartnersCoverage {
  readonly type: MonitoringActivityActionTypes.SET_PARTNERS_COVERAGE =
    MonitoringActivityActionTypes.SET_PARTNERS_COVERAGE;
  constructor(public payload: PartnersCoverage[]) {}
}

export class SetInterventionsCoverage {
  readonly type: MonitoringActivityActionTypes.SET_INTERVENTIONS_COVERAGE =
    MonitoringActivityActionTypes.SET_INTERVENTIONS_COVERAGE;
  constructor(public payload: InterventionsCoverage[]) {}
}

export class SetCpOutputCoverage {
  readonly type: MonitoringActivityActionTypes.SET_CP_OUTPUT_COVERAGE =
    MonitoringActivityActionTypes.SET_CP_OUTPUT_COVERAGE;
  constructor(public payload: CpOutputCoverage[]) {}
}

export class SetSections {
  readonly type: MonitoringActivityActionTypes.SET_SECTIONS = MonitoringActivityActionTypes.SET_SECTIONS;
  constructor(public payload: EtoolsSection[]) {}
}

export class SetGeographicCoverage {
  readonly type: MonitoringActivityActionTypes.SET_GEOGRAPHIC_COVERAGE =
    MonitoringActivityActionTypes.SET_GEOGRAPHIC_COVERAGE;
  constructor(public payload: GeographicCoverage[]) {}
}

export class SetOpenIssuesPartnership {
  readonly type: MonitoringActivityActionTypes.SET_OPEN_ISSUES_PARTNERSHIP =
    MonitoringActivityActionTypes.SET_OPEN_ISSUES_PARTNERSHIP;
  constructor(public payload: OpenIssuesActionPoints[]) {}
}

export class SetOpenIssuesCpOutput {
  readonly type: MonitoringActivityActionTypes.SET_OPEN_ISSUES_CP_OUTPUT =
    MonitoringActivityActionTypes.SET_OPEN_ISSUES_CP_OUTPUT;
  constructor(public payload: OpenIssuesActionPoints[]) {}
}

export class SetOpenIssuesLocation {
  readonly type: MonitoringActivityActionTypes.SET_OPEN_ISSUES_LOCATION =
    MonitoringActivityActionTypes.SET_OPEN_ISSUES_LOCATION;
  constructor(public payload: OpenIssuesActionPoints[]) {}
}

export class SwitchTab {
  readonly type: MonitoringActivityActionTypes.SWITCH_TAB = MonitoringActivityActionTypes.SWITCH_TAB;
  constructor(public payload: string) {}
}

export class SetHactVisits {
  readonly type: MonitoringActivityActionTypes.SET_HACT_VISITS = MonitoringActivityActionTypes.SET_HACT_VISITS;
  constructor(public payload: HactVisits[]) {}
}

export type MonitoringActivityActions =
  | SetOverallActivities
  | SetPartnersCoverage
  | SetInterventionsCoverage
  | SetCpOutputCoverage
  | SetSections
  | SetGeographicCoverage
  | SetOpenIssuesPartnership
  | SetOpenIssuesCpOutput
  | SetOpenIssuesLocation
  | SwitchTab
  | SetHactVisits;
