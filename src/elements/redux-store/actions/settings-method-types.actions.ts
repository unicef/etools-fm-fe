export const SET_METHOD_TYPES_LIST = 'SET_METHODS_LIST';
export const START_METHOD_TYPE_UPDATING = 'START_METHOD_TYPE_UPDATING';
export const STOP_METHOD_TYPE_UPDATING = 'STOP_METHOD_TYPE_UPDATING';
export const SET_METHOD_TYPE_UPDATING_ERROR = 'SET_METHOD_TYPE_UPDATING_ERROR';

export class SetMethodTypesList {
    public readonly type = SET_METHOD_TYPES_LIST;
    public constructor(public payload: IStatedListData<MethodType>) {}
}

export class StartMethodTypeUpdating {
    public readonly type = START_METHOD_TYPE_UPDATING;
    public payload = {updateInProcess: true};
}

export class StopMethodTypeUpdating {
    public readonly type = STOP_METHOD_TYPE_UPDATING;
    public payload = {updateInProcess: false};
}

export class SetMethodTypeUpdatingError {
    public readonly type = SET_METHOD_TYPE_UPDATING_ERROR;
    public constructor(public payload: {errors: any}) {}
}

export type SettingsMethodTypesActions = SetMethodTypesList | StartMethodTypeUpdating |
    StopMethodTypeUpdating | SetMethodTypeUpdatingError;
