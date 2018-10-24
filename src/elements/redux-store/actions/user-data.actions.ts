export const ADD_USER_DATA = 'ADD_USER_DATA';

export class AddUserData {
    constructor(payload) {
        this.type = ADD_USER_DATA;
        this.payload = payload;
    }
}
