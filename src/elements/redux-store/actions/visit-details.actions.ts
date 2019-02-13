export const SET_CURRENT_VISIT = 'SET_CURRENT_VISIT';
export const SET_VISIT_DATA = 'SET_VISIT_DATA';
export const SET_VISIT_OPTIONS = 'SET_VISIT_OPTIONS';
export const START_VISIT_OPTIONS_LOADING = 'START_VISIT_OPTIONS_LOADING';
export const STOP_VISIT_OPTIONS_LOADING = 'STOP_VISIT_OPTIONS_LOADING';
export const START_VISIT_DETAILS_LOADING = 'START_VISIT_DETAILS_LOADING';
export const STOP_VISIT_DETAILS_LOADING = 'STOP_VISIT_DETAILS_LOADING';

export class SetCurrentVisit {
    public readonly type = SET_CURRENT_VISIT;
    public constructor(public visitId: number) {}
}

export class SetVisitData {
    public readonly type = SET_VISIT_DATA;
    public constructor(public visit: Visit, public visitId: number) {}
}

export class SetVisitOptions {
    public readonly type = SET_VISIT_OPTIONS;
    public constructor(public permissions: IBackendPermissions, public visitId: number) {}
}

export class StartVisitOptionsLoading {
    public readonly type = START_VISIT_OPTIONS_LOADING;
}

export class StopVisitOptionsLoading {
    public readonly type = STOP_VISIT_OPTIONS_LOADING;
}

export class StartVisitDetailsLoading {
    public readonly type = START_VISIT_DETAILS_LOADING;
}

export class StopVisitDetailsLoading {
    public readonly type = STOP_VISIT_DETAILS_LOADING;
}

export type VisitDetailsActions = SetVisitData | SetVisitOptions | StopVisitOptionsLoading |
    StartVisitDetailsLoading | StartVisitOptionsLoading | StopVisitDetailsLoading | SetCurrentVisit;