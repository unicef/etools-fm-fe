export const SET_VISITS_LIST = 'SET_VISITS_LIST';
export const START_VISITS_REQUEST = 'START_VISITS_REQUEST';
export const FINISH_VISITS_REQUEST = 'FINISH_VISITS_REQUEST';
export const SET_VISITS_ERRORS = 'SET_VISITS_LIST_ERRORS';
export const SET_VISITS_TOTAL_INFO = 'SET_VISITS_TOTAL_INFO';
export const SET_PLANNED_TOTAL_INFO = 'SET_PLANNED_TOTAL_INFO';

export class SetVisitsList {
    public readonly type = SET_VISITS_LIST;
    public constructor(public payload: IListData<Visit>) { }
}

export class StartVisitsRequest {
    public readonly type = START_VISITS_REQUEST;
}

export class FinishVisitsRequest {
    public readonly type = FINISH_VISITS_REQUEST;
}

export class SetVisitsError {
    public readonly type = SET_VISITS_ERRORS;
    public constructor(public payload: {errors: any}) {}
}

export class SetVisitsTotalInfo {
    public readonly type = SET_VISITS_TOTAL_INFO;
    public constructor(public payload: VisitsTotalPlanned) {}
}

export class SetPlannedTotalInfo {
    public readonly type = SET_PLANNED_TOTAL_INFO;
    public constructor(public payload: PlannedTotal) {}
}

export type VisitsActions = SetVisitsList | SetVisitsError | StartVisitsRequest |
    FinishVisitsRequest | SetVisitsTotalInfo | SetPlannedTotalInfo;
