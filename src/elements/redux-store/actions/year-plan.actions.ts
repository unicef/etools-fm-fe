export const SET_YEAR_PLAN_DATA = 'SET_YEAR_PLAN_DATA';
export const START_REQUEST_YEAR_PLAN = 'START_REQUEST_YEAR_PLAN';
export const FINISH_REQUEST_YEAR_PLAN = 'FINISH_REQUEST_YEAR_PLAN';

export class SetYearPlanData {
    public readonly type = SET_YEAR_PLAN_DATA;
    public constructor(public payload: YearPlan) {}
}

export class StartRequestYearPlan {
    public readonly type = START_REQUEST_YEAR_PLAN;
}

export class FinishRequestYearPlan {
    public readonly type = FINISH_REQUEST_YEAR_PLAN;
}

export type YearPlanActions = SetYearPlanData | StartRequestYearPlan | FinishRequestYearPlan;
