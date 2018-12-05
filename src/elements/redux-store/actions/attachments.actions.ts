export const SET_ATTACHMENTS = 'SET_ATTACHMENTS';
export const START_REQUEST_ATTACHMENTS = 'START_REQUEST_ATTACHMENTS';
export const FINISH_REQUEST_ATTACHMENTS = 'FINISH_REQUEST_ATTACHMENTS';

export class SetAttachments {
    public readonly type = SET_ATTACHMENTS;
    public constructor(public payload: IListData<Attachment>) {}
}

export class StartRequestAttachments {
    public readonly type = START_REQUEST_ATTACHMENTS;
}

export class FinishRequestAttachments {
    public readonly type = FINISH_REQUEST_ATTACHMENTS;
}

export type AttachmentsActions = SetAttachments | StartRequestAttachments | FinishRequestAttachments;
