export const INITIALIZE_APPLICATION: string = 'INITIALIZE_APPLICATION';
export const FINISH_INITIALIZATION: string = 'FINISH_INITIALIZATION';
export const IN_PROGRESS_INITIALIZATION_STATE: string = 'IN_PROGRESS';
export const FINISHED_INITIALIZATION_STATE: string = 'FINISHED';
export const INITIAL_INITIALIZATION_STATE: string = 'PENDING';

export class InitializeApplication {
    public readonly type: string = INITIALIZE_APPLICATION;
    public constructor(public payload: string[]) { }
}

export class FinishInitialisation {
    public readonly type: string = FINISH_INITIALIZATION;
    public constructor() { }
}
