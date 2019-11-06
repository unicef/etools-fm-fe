export enum MonitoringActivityActionTypes {
  SET_OVERALL_ACTIVITIES = '[Monitoring activity Action]: SET_OVERALL_ACTIVITIES',
  SET_PARTNERS_COVERAGE = '[Monitoring activity Action]: SET_PARTNERS_COVERAGE',
  SET_INTERVENTIONS_COVERAGE = '[Monitoring activity Action]: SET_INTERVENTIONS_COVERAGE',
  SET_CP_OUTPUT_COVERAGE = '[Monitoring activity Action]: SET_CP_OUTPUT_COVERAGE'
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

export class SetCpOutpurCoverage {
  readonly type: MonitoringActivityActionTypes.SET_CP_OUTPUT_COVERAGE =
    MonitoringActivityActionTypes.SET_CP_OUTPUT_COVERAGE;
  constructor(public payload: CpOutputCoverage[]) {}
}

export type MonitoringActivityActions =
  | SetOverallActivities
  | SetPartnersCoverage
  | SetInterventionsCoverage
  | SetCpOutpurCoverage;
