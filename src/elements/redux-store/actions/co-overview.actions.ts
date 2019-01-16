export const SET_FULL_REPORT_DATA = 'SET_FULL_REPORT_DATA';

export class SetFullReportData {
    public readonly type = SET_FULL_REPORT_DATA;
    public constructor(public payload: FullReportData) { }
}
