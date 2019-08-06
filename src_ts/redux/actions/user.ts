export enum UserActionTypes {
    UPDATE_USER_DATA = '[User Action]: UPDATE_USER_DATA',
    UPDATE_USER_PERMISSIONS = '[User Action]: UPDATE_USER_PERMISSIONS'
}

export class UpdateUserData {
    public readonly type: UserActionTypes.UPDATE_USER_DATA = UserActionTypes.UPDATE_USER_DATA;
    public constructor(public data: IEtoolsUserModel) {}
}

export class UpdateUserPermissions {
    public readonly type: UserActionTypes.UPDATE_USER_PERMISSIONS = UserActionTypes.UPDATE_USER_PERMISSIONS;
    public constructor(public permissions: GenericObject) {}
}

export type UserAction = UpdateUserData | UpdateUserPermissions;
