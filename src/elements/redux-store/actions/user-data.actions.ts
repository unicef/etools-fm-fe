export const ADD_USER_DATA = 'ADD_USER_DATA';

export class AddUserData {
    public readonly type = ADD_USER_DATA;
    public constructor(public payload: IUserProfile) { }
}
