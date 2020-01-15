export enum RationaleActionTypes {
  SET_RATIONALE = '[Rationale Action]: SET_RATIONALE',
  SET_RATIONALE_UPDATE_STATE = '[Rationale Action]: SET_RATIONALE_UPDATE_STATE',
  SET_RATIONALE_UPDATE_ERROR = '[Rationale Action]: SET_RATIONALE_UPDATE_ERROR'
}

export class SetRationale {
  readonly type: RationaleActionTypes.SET_RATIONALE = RationaleActionTypes.SET_RATIONALE;

  constructor(public payload: IRationale) {}
}

export class SetRationaleUpdateState {
  readonly type: RationaleActionTypes.SET_RATIONALE_UPDATE_STATE = RationaleActionTypes.SET_RATIONALE_UPDATE_STATE;

  constructor(public payload: boolean | null) {}
}

export class SetRationaleUpdateError {
  readonly type: RationaleActionTypes.SET_RATIONALE_UPDATE_ERROR = RationaleActionTypes.SET_RATIONALE_UPDATE_ERROR;

  constructor(public payload: any) {}
}

export type Rationalections = SetRationale | SetRationaleUpdateState | SetRationaleUpdateError;
