export const SET_TASKS_LIST = 'SET_TASKS_LIST';
export const START_TASKS_UPDATING = 'START_TASKS_UPDATING';
export const STOP_TASKS_UPDATING = 'STOP_TASKS_UPDATING';
export const SET_TASKS_UPDATING_ERROR = 'SET_TASKS_UPDATING_ERROR';
export const SET_PARTNER_TASKS_LOADING_STATE = 'SET_PARTNER_TASKS_LOADING_STATE';
export const SET_PARTNER_TASKS = 'SET_PARTNER_TASKS';
export const SET_INTERVENTION_LOCATIONS = 'SET_INTERVENTION_LOCATIONS';

export class SetTasksList {
    public readonly type = SET_TASKS_LIST;
    public constructor(public payload: IStatedListData<PlaningTask>) {}
}

export class StartTasksUpdating {
    public readonly type = START_TASKS_UPDATING;
}

export class StopTasksUpdating {
    public readonly type = STOP_TASKS_UPDATING;
}

export class SetTasksUpdatingError {
    public readonly type = SET_TASKS_UPDATING_ERROR;
    public constructor(public payload: {errors: any}) {}
}

export class SetPartnerTasks {
    public readonly type = SET_PARTNER_TASKS;
    public constructor(public payload: PlaningTask[]) {}
}

export class SetPartnerTasksLoadingState {
    public readonly type = SET_PARTNER_TASKS_LOADING_STATE;
    public constructor(public payload: boolean) {}
}

export class SetInterventionLocations {
    public readonly type = SET_INTERVENTION_LOCATIONS;
    public constructor(public payload: ISiteParrentLocation[]) {}
}

export type PlaningTasksActions = SetTasksList | StartTasksUpdating | SetInterventionLocations |
    StopTasksUpdating | SetTasksUpdatingError | SetPartnerTasks | SetPartnerTasksLoadingState;
