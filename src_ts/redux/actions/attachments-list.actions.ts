export enum AttachmentsActionTypes {
  SET_ATTACHMENTS_LIST = '[Attachments Action]: SET_ATTACHMENTS_LIST',
  SET_ATTACHMENTS_UPDATE_STATE = '[Attachments Action]: SET_ATTACHMENTS_UPDATE_STATE',
  SET_ATTACHMENTS_UPDATE_ERROR = '[Attachments Action]: SET_ATTACHMENTS_UPDATE_ERROR'
}

export class SetAttachmentsList {
  readonly type: AttachmentsActionTypes.SET_ATTACHMENTS_LIST = AttachmentsActionTypes.SET_ATTACHMENTS_LIST;

  constructor(public payload: {name: string; data: IListData<Attachment> | Attachment[]}) {}
}

export class SetAttachmentsUpdateState {
  readonly type: AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_STATE =
    AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_STATE;

  constructor(public payload: boolean | null) {}
}

export class SetAttachmentsUpdateError {
  readonly type: AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_ERROR =
    AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_ERROR;

  constructor(public payload: any) {}
}

export type AttachmentsActions = SetAttachmentsList | SetAttachmentsUpdateState | SetAttachmentsUpdateError;
