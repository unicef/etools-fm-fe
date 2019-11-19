export enum FullReportsActionTypes {
  FULL_REPORT_DATA_REQUEST = '[Full Report Action]: FULL_REPORT_DATA_REQUEST',
  FULL_REPORT_DATA_SUCCESS = '[Full Report Action]: FULL_REPORT_DATA_SUCCESS',
  FULL_REPORT_DATA_FAILURE = '[Full Report Action]: FULL_REPORT_DATA_FAILURE'
}

export class FullReportDataRequest {
  public readonly type: FullReportsActionTypes.FULL_REPORT_DATA_REQUEST =
    FullReportsActionTypes.FULL_REPORT_DATA_REQUEST;
}

export class FullReportDataSuccess {
  public readonly type: FullReportsActionTypes.FULL_REPORT_DATA_SUCCESS =
    FullReportsActionTypes.FULL_REPORT_DATA_SUCCESS;
  public constructor(public payload: FullReportData) {}
}

export class FullReportDataFailure {
  public readonly type: FullReportsActionTypes.FULL_REPORT_DATA_FAILURE =
    FullReportsActionTypes.FULL_REPORT_DATA_FAILURE;
  public constructor(public payload: GenericObject) {}
}

export type FullReportsActions = FullReportDataRequest | FullReportDataSuccess | FullReportDataFailure;
