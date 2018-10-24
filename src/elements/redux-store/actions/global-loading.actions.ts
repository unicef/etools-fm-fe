export const RUN_GLOBAL_LOADING = 'RUN_GLOBAL_LOADING';
export const STOP_GLOBAL_LOADING = 'STOP_GLOBAL_LOADING';

export class RunGlobalLoading {
    public readonly type = RUN_GLOBAL_LOADING;
    public constructor(public payload: LoadingData) { }
}

export class StopGlobalLoading {
    public readonly type = STOP_GLOBAL_LOADING;
    public constructor(public payload: LoadingData) { }
}

export type LoadingActions = RunGlobalLoading | StopGlobalLoading;
