export enum UserActionTypes {
    START_UPDATE_USER_DATA = '[User Action]: START_UPDATE_USER_DATA',
    FINISH_UPDATE_USER_DATA = '[User Action]: FINISH_UPDATE_USER_DATA',
    ERROR_UPDATE_USER_DATA = '[User Action]: ERROR_UPDATE_USER_DATA',
    UPDATE_USER_DATA = '[User Action]: UPDATE_USER_DATA',
    UPDATE_USER_PERMISSIONS = '[User Action]: UPDATE_USER_PERMISSIONS',
}

export class StartUpdateUserData {
    public readonly type: UserActionTypes.START_UPDATE_USER_DATA = UserActionTypes.START_UPDATE_USER_DATA;
}

export class FinishUpdateUserData {
    public readonly type: UserActionTypes.FINISH_UPDATE_USER_DATA = UserActionTypes.FINISH_UPDATE_USER_DATA;
}

export class ErrorUpdateUserData {
    public readonly type: UserActionTypes.ERROR_UPDATE_USER_DATA = UserActionTypes.ERROR_UPDATE_USER_DATA;
    public constructor(public error: GenericObject) {}
}

export class UpdateUserData {
    public readonly type: UserActionTypes.UPDATE_USER_DATA = UserActionTypes.UPDATE_USER_DATA;
    public constructor(public data: IEtoolsUserModel) {}
}

export class UpdateUserPermissions {
    public readonly type: UserActionTypes.UPDATE_USER_PERMISSIONS = UserActionTypes.UPDATE_USER_PERMISSIONS;
    public constructor(public permissions: GenericObject) {}
}

export type UserAction = UpdateUserData | UpdateUserPermissions | StartUpdateUserData | FinishUpdateUserData |
    ErrorUpdateUserData;
