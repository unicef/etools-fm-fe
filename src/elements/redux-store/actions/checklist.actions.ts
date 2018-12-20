export const SET_CHECKLIST_CP_OUTPUTS_CONFIGS = 'SET_CHECKLIST_CP_OUTPUTS_CONFIGS';
export const SET_CHECKLIST_METHOD_TYPES = 'SET_CHECKLIST_METHOD_TYPES';
export const SET_CHECKLIST_PLANED = 'SET_CHECKLIST_PLANED';
export const START_REQUEST_CHECKLIST = 'START_REQUEST_CHECKLIST';
export const FINISH_REQUEST_CHECKLIST = 'FINISH_REQUEST_CHECKLIST';
export const SET_ERROR_CHECKLIST_CONFIG = 'SET_ERROR_CHECKLIST_CONFIG';
export const UPDATE_CHECKLIST_CONFIG = 'UPDATE_CHECKLIST_CONFIG';
export const UPDATE_CHECKLIST_PLANED = 'UPDATE_CHECKLIST_PLANED';

export class SetChecklistCpOutputsConfigs {
    public readonly type = SET_CHECKLIST_CP_OUTPUTS_CONFIGS;
    public constructor(public payload: IListData<CpOutputConfig>) { }
}

export class SetChecklistPlaned {
    public readonly type = SET_CHECKLIST_PLANED;
    public constructor(public payload: IListData<ChecklistPlanedItem>) { }
}

export class SetChecklistMethodTypes {
    public readonly type = SET_CHECKLIST_METHOD_TYPES;
    public constructor(public payload: IListData<MethodType>) { }
}

export class StartRequestChecklist {
    public readonly type = START_REQUEST_CHECKLIST;
}

export class FinishRequestChecklist {
    public readonly type = FINISH_REQUEST_CHECKLIST;
}

export class UpdateChecklistConfig {
    public readonly type = UPDATE_CHECKLIST_CONFIG;
    public constructor(public payload: CpOutputConfig) { }
}

export class UpdateChecklistPlaned {
    public readonly type = UPDATE_CHECKLIST_PLANED;
    public constructor(public payload: ChecklistPlanedItem) { }
}

export class SetRequestErrorChecklistConfig {
    public readonly type = SET_ERROR_CHECKLIST_CONFIG;
    public constructor(public payload: {errors: any}) {}
}

export type ChecklistActions = SetChecklistCpOutputsConfigs | SetChecklistPlaned | UpdateChecklistPlaned |
    SetChecklistMethodTypes | StartRequestChecklist | FinishRequestChecklist |
    SetRequestErrorChecklistConfig | UpdateChecklistConfig;
