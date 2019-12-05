export enum FindingsActionTypes {
  SET_EDITED_FINDINGS_COMPONENT = '[Findings Component Action]: SET_EDITED_FINDINGS_COMPONENT',
  SET_FINDINGS_UPDATE_STATE = '[Findings Component Action]: SET_FINDINGS_UPDATE_STATE'
}

export class SetEditedFindingsCard {
  type: FindingsActionTypes.SET_EDITED_FINDINGS_COMPONENT = FindingsActionTypes.SET_EDITED_FINDINGS_COMPONENT;
  constructor(public payload: string | null) {}
}

export class SetFindingsUpdateState {
  type: FindingsActionTypes.SET_FINDINGS_UPDATE_STATE = FindingsActionTypes.SET_FINDINGS_UPDATE_STATE;
  constructor(public payload: boolean | null) {}
}

export type FindingsActions = SetEditedFindingsCard | SetFindingsUpdateState;
