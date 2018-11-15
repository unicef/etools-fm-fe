export const SET_YEAR_PLAN_DATA = 'SET_YEAR_PLAN_DATA';

export class SetYearPlanData {
    public readonly type = SET_YEAR_PLAN_DATA;
    public constructor(public payload: YearPlan) {}
}

export type YearPlanActions = SetYearPlanData;