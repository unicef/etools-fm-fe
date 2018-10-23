export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const RESET_NOTIFICATIONS = 'RESET_NOTIFICATIONS';

export class AddNotification {
    constructor(text) {
        this.type = ADD_NOTIFICATION;
        this.payload = text;
    }
}

export class RemoveNotification {
    constructor(id) {
        this.type = REMOVE_NOTIFICATION;
        this.payload = id;
    }
}

export class ResetNotification {
    constructor() {
        this.type = RESET_NOTIFICATIONS;
    }
}
