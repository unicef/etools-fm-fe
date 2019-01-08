export const SET_VISITS_LIST = 'SET_VISITS_LIST';
export const START_VISITS_REQUEST = 'START_VISITS_REQUEST';
export const FINISH_VISITS_REQUEST = 'FINISH_VISITS_REQUEST';
export const SET_VISITS_ERRORS = 'SET_VISITS_LIST_ERRORS';

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

export type VisitsActions = SetVisitsList | SetVisitsError | StartVisitsRequest | FinishVisitsRequest;
