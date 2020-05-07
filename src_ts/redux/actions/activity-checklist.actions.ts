export enum ActivityChecklistActionTypes {
  SET_ACTIVITY_CHECKLIST = '[Activities Action]: SET_ACTIVITY_CHECKLIST',
  SET_EDITED_CHECKLIST_CARD = '[Activities Action]: SET_EDITED_CHECKLIST_CARD'
}

export class SetActivityChecklist {
  readonly type: ActivityChecklistActionTypes.SET_ACTIVITY_CHECKLIST =
    ActivityChecklistActionTypes.SET_ACTIVITY_CHECKLIST;

  constructor(public payload: IChecklistItem[]) {}
}

export class SetEditedChecklistCard {
  readonly type: ActivityChecklistActionTypes.SET_EDITED_CHECKLIST_CARD =
    ActivityChecklistActionTypes.SET_EDITED_CHECKLIST_CARD;

  constructor(public payload: string | null) {}
}

export type ActivityChecklistActions = SetActivityChecklist | SetEditedChecklistCard;
