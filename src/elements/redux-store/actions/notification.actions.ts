export const ADD_NOTIFICATION = 'ADD_NOTIFICATION';
export const REMOVE_NOTIFICATION = 'REMOVE_NOTIFICATION';
export const RESET_NOTIFICATIONS = 'RESET_NOTIFICATIONS';

export class AddNotification {
    public readonly type = ADD_NOTIFICATION;
    public constructor(public payload: string) { }
}

export class RemoveNotification {
    public readonly type = REMOVE_NOTIFICATION;
    public constructor(public payload: string) { }
}

export class ResetNotification {
    public readonly type = RESET_NOTIFICATIONS;
    public constructor() { }
}

export type NotificationActions = AddNotification | RemoveNotification | ResetNotification;
