export enum CountryOverviewActionTypes {
    SET_FULL_REPORT_DATA = '[Country Overview Action]: SET_FULL_REPORT_DATA',
}

export class SetFullReportData {
    public readonly type: CountryOverviewActionTypes.SET_FULL_REPORT_DATA =
        CountryOverviewActionTypes.SET_FULL_REPORT_DATA;
    // TODO: add here FullReport interface!!!
    public constructor(public payload: any) { }
}

export type CountryOverviewActions = SetFullReportData;