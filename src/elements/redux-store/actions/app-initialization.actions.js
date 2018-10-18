export const INITIALIZE_APPLICATION = 'INITIALIZE_APPLICATION';
export const FINISH_INITIALIZATION = 'FINISH_INITIALIZATION';
export const IN_PROGRESS_INITIALIZATION_STATE = 'IN_PROGRESS';
export const FINISHED_INITIALIZATION_STATE = 'FINISHED';
export const INITIAL_INITIALIZATION_STATE = 'PENDING';

export class InitializeApplication {
    constructor(staticDataNames) {
        this.type = INITIALIZE_APPLICATION;
        this.payload = staticDataNames;
    }
}

export class FinishInitialisation {
    constructor() {
        this.type = FINISH_INITIALIZATION;
    }
}
