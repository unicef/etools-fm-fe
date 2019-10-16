export enum ActivityChecklistActionTypes {
    SET_ACTIVITY_CHECKLIST = '[Activities Action]: SET_ACTIVITY_CHECKLIST',
    SET_EDITED_CHECKLIST_CARD = '[Activities Action]: SET_EDITED_CHECKLIST_CARD'
}

export class SetActivityChecklist {
    public readonly type: ActivityChecklistActionTypes.SET_ACTIVITY_CHECKLIST =
        ActivityChecklistActionTypes.SET_ACTIVITY_CHECKLIST;
    public constructor(public payload: IChecklistItem[]) {}
}

export class SetEditedChecklistCard {
    public readonly type: ActivityChecklistActionTypes.SET_EDITED_CHECKLIST_CARD =
        ActivityChecklistActionTypes.SET_EDITED_CHECKLIST_CARD;
    public constructor(public payload: string | null) {}
}

export type ActivityChecklistActions = SetActivityChecklist | SetEditedChecklistCard;
