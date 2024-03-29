import {Reducer} from 'redux';
import {AttachmentsActions, AttachmentsActionTypes} from '../actions/attachments-list.actions';
import {
  ACTIVITY_RELATED_DOCUMENTS,
  ACTIVITY_REPORT_ATTACHMENTS,
  RATIONALE_ATTACHMENTS
} from '../../endpoints/endpoints-list';

const INITIAL_STATE: IAttachmentsListState = {
  [RATIONALE_ATTACHMENTS]: null,
  updateInProcess: null,
  error: {},
  permissions: {},
  attachmentsTypes: {
    [RATIONALE_ATTACHMENTS]: [],
    [ACTIVITY_RELATED_DOCUMENTS]: [],
    [ACTIVITY_REPORT_ATTACHMENTS]: []
  }
};

export const attachmentsList: Reducer<IAttachmentsListState, any> = (
  state: IAttachmentsListState = INITIAL_STATE,
  action: AttachmentsActions
) => {
  switch (action.type) {
    case AttachmentsActionTypes.SET_ATTACHMENTS_LIST:
      const {name, data} = action.payload;
      return {...state, [name]: data};
    case AttachmentsActionTypes.SET_ATTACHMENTS_OPTIONS:
      return {...state, permissions: action.payload};
    case AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_STATE:
      return {...state, updateInProcess: action.payload};
    case AttachmentsActionTypes.SET_ATTACHMENTS_UPDATE_ERROR:
      return {...state, error: action.payload};
    case AttachmentsActionTypes.SET_ATTACHMENTS_TYPES:
      return {...state, attachmentsTypes: {...state.attachmentsTypes, [action.payload.name]: action.payload.data}};
    default:
      return state;
  }
};
