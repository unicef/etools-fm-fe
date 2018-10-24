export const RUN_GLOBAL_LOADING = 'RUN_GLOBAL_LOADING';
export const STOP_GLOBAL_LOADING = 'STOP_GLOBAL_LOADING';

export class RunGlobalLoading {
    constructor(loadingInfo) {
        this.type = RUN_GLOBAL_LOADING;
        this.payload = loadingInfo;
    }
}

export class StopGlobalLoading {
    constructor(loadingInfo) {
        this.type = STOP_GLOBAL_LOADING;
        this.payload = loadingInfo;
    }
}
