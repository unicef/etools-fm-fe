export enum FullReportsActionTypes {
  FULL_REPORT_DATA_REQUEST = '[Full Report Action]: FULL_REPORT_DATA_REQUEST',
  FULL_REPORT_DATA_SUCCESS = '[Full Report Action]: FULL_REPORT_DATA_SUCCESS',
  FULL_REPORT_DATA_FAILURE = '[Full Report Action]: FULL_REPORT_DATA_FAILURE'
}

export class FullReportDataRequest {
  readonly type: FullReportsActionTypes.FULL_REPORT_DATA_REQUEST = FullReportsActionTypes.FULL_REPORT_DATA_REQUEST;
}

export class FullReportDataSuccess {
  readonly type: FullReportsActionTypes.FULL_REPORT_DATA_SUCCESS = FullReportsActionTypes.FULL_REPORT_DATA_SUCCESS;
  constructor(public payload: FullReportData) {}
}

export class FullReportDataFailure {
  readonly type: FullReportsActionTypes.FULL_REPORT_DATA_FAILURE = FullReportsActionTypes.FULL_REPORT_DATA_FAILURE;
  constructor(public payload: GenericObject) {}
}

export type FullReportsActions = FullReportDataRequest | FullReportDataSuccess | FullReportDataFailure;
