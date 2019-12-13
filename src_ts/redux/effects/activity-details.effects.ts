import {IAsyncAction} from '../middleware';
import {getEndpoint} from '../../endpoints/endpoints';
import {ACTIVITIES_LIST, ACTIVITY_CHECKLIST_ATTACHMENTS, ACTIVITY_DETAILS} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {
  ActivityDetailsActions,
  ChecklistAttachmentsRequest,
  ChecklistAttachmentsTypesRequest
} from '../actions/activity-details.actions';
import {Dispatch} from 'redux';

export function requestActivityDetails(id: string): IAsyncAction {
  return {
    types: [
      ActivityDetailsActions.ACTIVITY_DETAILS_GET_REQUEST,
      ActivityDetailsActions.ACTIVITY_DETAILS_GET_SUCCESS,
      ActivityDetailsActions.ACTIVITY_DETAILS_GET_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(ACTIVITY_DETAILS, {id});
      const resultUrl: string = `${url}`;
      return request(resultUrl);
    }
  };
}

export function createActivityDetails(): IAsyncAction {
  return {
    types: [
      ActivityDetailsActions.ACTIVITY_DETAILS_CREATE_REQUEST,
      ActivityDetailsActions.ACTIVITY_DETAILS_CREATE_SUCCESS,
      ActivityDetailsActions.ACTIVITY_DETAILS_CREATE_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(ACTIVITIES_LIST);
      const options: RequestInit = {
        method: 'POST'
      };
      return request(url, options);
    }
  };
}

export function updateActivityDetails(id: number, activityDetails: Partial<IActivityDetails>): IAsyncAction {
  return {
    types: [
      ActivityDetailsActions.ACTIVITY_DETAILS_UPDATE_REQUEST,
      ActivityDetailsActions.ACTIVITY_DETAILS_UPDATE_SUCCESS,
      ActivityDetailsActions.ACTIVITY_DETAILS_UPDATE_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(ACTIVITY_DETAILS, {id});
      const options: RequestInit = {
        method: 'PATCH',
        body: JSON.stringify(activityDetails)
      };
      return request(url, options);
    }
  };
}

export function changeActivityStatus(id: number, activityDetails: Partial<IActivityDetails>): IAsyncAction {
  return {
    types: [
      ActivityDetailsActions.ACTIVITY_STATUS_CHANGE_REQUEST,
      ActivityDetailsActions.ACTIVITY_STATUS_CHANGE_SUCCESS,
      ActivityDetailsActions.ACTIVITY_STATUS_CHANGE_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(ACTIVITY_DETAILS, {id});
      const options: RequestInit = {
        method: 'PATCH',
        body: JSON.stringify(activityDetails)
      };
      return request(url, options);
    }
  };
}

export function loadChecklistAttachments(activityId: number): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTIVITY_CHECKLIST_ATTACHMENTS, {activityId});
    return request<IListData<IChecklistAttachment>>(url, {method: 'GET'}).then(
      (response: IListData<IChecklistAttachment>) => {
        dispatch(new ChecklistAttachmentsRequest(response.results));
      }
    );
  };
}

export function loadChecklistAttachmentsTypes(activityId: number): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTIVITY_CHECKLIST_ATTACHMENTS, {activityId});
    return request<AttachmentType[]>(`${url}file-types?page_size=all`, {method: 'GET'}).then(
      (response: AttachmentType[]) => {
        dispatch(new ChecklistAttachmentsTypesRequest(response));
      }
    );
  };
}
