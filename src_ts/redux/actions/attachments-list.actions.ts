export enum AttachmentsActionTypes {
    SET_ATTACHMENTS_LIST = '[Attachments Action]: SET_ATTACHMENTS_LIST',
    SET_ATTACHMENTS_UPDATE_STATE = '[Attachments Action]: SET_ATTACHMENTS_UPDATE_STATE',
    SET_ATTACHMENTS_UPDATE_ERROR = '[Attachments Action]: SET_ATTACHMENTS_UPDATE_ERROR'
}

export class SetAttachmentsList {
    public readonly type: AttachmentsActionTypes.SET_ATTACHMENTS_LIST = AttachmentsActionTypes.SET_ATTACHMENTS_LIST;
    public constructor(public payload: { name: string; data: IListData<Attachment> }) {}
}

export class SetAttachmentsUpdateState {
    public readonly type: AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_STATE =
        AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_STATE;
    public constructor(public payload: boolean | null) {}
}

export class SetAttachmentsUpdateError {
    public readonly type: AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_ERROR =
        AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_ERROR;
    public constructor(public payload: any) {}
}

export type AttachmentsActions = SetAttachmentsList | SetAttachmentsUpdateState | SetAttachmentsUpdateError;
