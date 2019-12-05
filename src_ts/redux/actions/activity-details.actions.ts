export enum ActivityDetailsActions {
  SET_EDITED_DETAILS_CARD = '[Activity Details Action]: SET_EDITED_DETAILS_CARD',

  ACTIVITY_DETAILS_GET_REQUEST = '[Activity Details Action]: ACTIVITY_DETAILS_GET_REQUEST',
  ACTIVITY_DETAILS_GET_SUCCESS = '[Activity Details Action]: ACTIVITY_DETAILS_GET_SUCCESS',
  ACTIVITY_DETAILS_GET_FAILURE = '[Activity Details Action]: ACTIVITY_DETAILS_GET_FAILURE',

  ACTIVITY_DETAILS_CREATE_REQUEST = '[Activity Details Action]: ACTIVITY_DETAILS_CREATE_REQUEST',
  ACTIVITY_DETAILS_CREATE_SUCCESS = '[Activity Details Action]: ACTIVITY_DETAILS_CREATE_SUCCESS',
  ACTIVITY_DETAILS_CREATE_FAILURE = '[Activity Details Action]: ACTIVITY_DETAILS_CREATE_FAILURE',

  ACTIVITY_DETAILS_UPDATE_REQUEST = '[Activity Details Action]: ACTIVITY_DETAILS_UPDATE_REQUEST',
  ACTIVITY_DETAILS_UPDATE_SUCCESS = '[Activity Details Action]: ACTIVITY_DETAILS_UPDATE_SUCCESS',
  ACTIVITY_DETAILS_UPDATE_FAILURE = '[Activity Details Action]: ACTIVITY_DETAILS_UPDATE_FAILURE',

  ACTIVITY_STATUS_CHANGE_REQUEST = '[Activity Details Action]: ACTIVITY_STATUS_CHANGE_REQUEST',
  ACTIVITY_STATUS_CHANGE_SUCCESS = '[Activity Details Action]: ACTIVITY_STATUS_CHANGE_SUCCESS',
  ACTIVITY_STATUS_CHANGE_FAILURE = '[Activity Details Action]: ACTIVITY_STATUS_CHANGE_FAILURE',

  CHECKLIST_ATTACHMENTS_REQUEST = '[Activity Details Action]: CHECKLIST_ATTACHMENTS_REQUEST'
}

export class SetEditedDetailsCard {
  readonly type: ActivityDetailsActions.SET_EDITED_DETAILS_CARD = ActivityDetailsActions.SET_EDITED_DETAILS_CARD;

  constructor(public payload: string | null) {}
}

export class ChecklistAttachmentsRequest {
  readonly type: ActivityDetailsActions.CHECKLIST_ATTACHMENTS_REQUEST =
    ActivityDetailsActions.CHECKLIST_ATTACHMENTS_REQUEST;
  constructor(public payload: IChecklistAttachment[]) {}
}
