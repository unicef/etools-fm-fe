export const SET_CHECKLIST_CP_OUTPUTS_CONFIGS = 'SET_CHECKLIST_CP_OUTPUTS_CONFIGS';
export const SET_CHECKLIST_CATEGORIES = 'SET_CHECKLIST_CATEGORIES';
export const SET_CHECKLIST_ITEMS = 'SET_CHECKLIST_ITEMS';
export const SET_CHECKLIST_METHOD_TYPES = 'SET_CHECKLIST_METHOD_TYPES';
export const START_REQUEST_CHECKLIST_CONFIG = 'START_REQUEST_CHECKLIST_CONFIG';
export const FINISH_REQUEST_CHECKLIST_CONFIG = 'FINISH_REQUEST_CHECKLIST_CONFIG';
export const SET_ERROR_CHECKLIST_CONFIG = 'SET_ERROR_CHECKLIST_CONFIG';
export const UPDATE_CHECKLIST_CONFIG = 'UPDATE_CHECKLIST_CONFIG';

export class SetChecklistCpOutputsConfigs {
    public readonly type = SET_CHECKLIST_CP_OUTPUTS_CONFIGS;
    public constructor(public payload: IListData<CpOutputConfig>) { }
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

export class StartRequestChecklistConfig {
    public readonly type = START_REQUEST_CHECKLIST_CONFIG;
}

export class FinishRequestChecklistConfig {
    public readonly type = FINISH_REQUEST_CHECKLIST_CONFIG;
}

export class UpdateChecklistConfig {
    public readonly type = UPDATE_CHECKLIST_CONFIG;
    public constructor(public payload: CpOutputConfig) { }
}

export class SetRequestErrorChecklistConfig {
    public readonly type = SET_ERROR_CHECKLIST_CONFIG;
    public constructor(public payload: {errors: any}) {}
}

export type ChecklistActions = SetChecklistCpOutputsConfigs | SetChecklistCategories | SetChecklistItems |
    SetChecklistMethodTypes | StartRequestChecklistConfig | FinishRequestChecklistConfig |
    SetRequestErrorChecklistConfig | UpdateChecklistConfig;
