export enum CountryOverviewActionTypes {
  SET_FULL_REPORT_DATA = '[Country Overview Action]: SET_FULL_REPORT_DATA'
}

export class SetFullReportData {
  public readonly type: CountryOverviewActionTypes.SET_FULL_REPORT_DATA =
    CountryOverviewActionTypes.SET_FULL_REPORT_DATA;
  public constructor(public payload: FullReportData) {}
}

export type CountryOverviewActions = SetFullReportData;
