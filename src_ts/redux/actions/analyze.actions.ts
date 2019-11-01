export enum AnalyzeActionTypes {
    SET_OVERALL_ACTIVITIES = '[Analyze Action]: SET_OVERALL_ACTIVITIES'
}

export class SetOverallActivities {
    public readonly type: AnalyzeActionTypes.SET_OVERALL_ACTIVITIES = AnalyzeActionTypes.SET_OVERALL_ACTIVITIES;
    public constructor(public payload: OverallActivities) {}
}

export type AnalyzeActions = SetOverallActivities;
