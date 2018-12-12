export const SET_CHECKLIST_CP_OUTPUTS = 'SET_CHECKLIST_CP_OUTPUTS';
export const SET_CHECKLIST_CATEGORIES = 'SET_CHECKLIST_CATEGORIES';
export const SET_CHECKLIST_ITEMS = 'SET_CHECKLIST_ITEMS';
export const SET_CHECKLIST_METHOD_TYPES = 'SET_CHECKLIST_METHOD_TYPES';

export class SetChecklistCpOutputs {
    public readonly type = SET_CHECKLIST_CP_OUTPUTS;
    public constructor(public payload: IListData<CpOutput>) { }
}

export class SetChecklistCategories {
    public readonly type = SET_CHECKLIST_CATEGORIES;
    public constructor(public payload: IListData<ChecklistCategory>) { }
}

export class SetChecklistItems {
    public readonly type = SET_CHECKLIST_ITEMS;
    public constructor(public payload: IListData<ChecklistItem>) { }
}

export class SetChecklistMethodTypes {
    public readonly type = SET_CHECKLIST_METHOD_TYPES;
    public constructor(public payload: IListData<MethodType>) { }
}

export type ChecklistActions = SetChecklistCpOutputs | SetChecklistCategories | SetChecklistItems |
    SetChecklistMethodTypes;
