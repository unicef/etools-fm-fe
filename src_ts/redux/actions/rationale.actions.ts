export enum RationaleActionTypes {
    SET_RATIONALE = '[Rationale Action]: SET_RATIONALE',
    SET_RATIONALE_UPDATE_STATE = '[Rationale Action]: SET_RATIONALE_UPDATE_STATE',
    SET_RATIONALE_UPDATE_ERROR = '[Rationale Action]: SET_RATIONALE_UPDATE_ERROR'
}

export class SetRationale {
    public readonly type: RationaleActionTypes.SET_RATIONALE = RationaleActionTypes.SET_RATIONALE;
    public constructor(public payload: IRationale) {}
}

export class SetRationaleUpdateState {
    public readonly type: RationaleActionTypes.SET_RATIONALE_UPDATE_STATE =
        RationaleActionTypes.SET_RATIONALE_UPDATE_STATE;
    public constructor(public payload: boolean | null) {}
}

export class SetRationaleUpdateError {
    public readonly type: RationaleActionTypes.SET_RATIONALE_UPDATE_ERROR =
        RationaleActionTypes.SET_RATIONALE_UPDATE_ERROR;
    public constructor(public payload: any) {}
}

export type Rationalections = SetRationale | SetRationaleUpdateState | SetRationaleUpdateError;
