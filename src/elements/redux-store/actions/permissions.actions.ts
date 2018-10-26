export const SET_PERMISSIONS = 'SET_PERMISSIONS';

export class SetPermissions {
    public readonly type = SET_PERMISSIONS;
    public constructor(
        public collectionName: string,
        public payload: IBackendPermissions) { }
}

export type PermissionsActions = SetPermissions;
