import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {
  SetAttachmentsList,
  SetAttachmentsUpdateError,
  SetAttachmentsUpdateState
} from '../actions/attachments-list.actions';

export function loadAttachmentsList(
  endpointName: string,
  endpointData: GenericObject
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(endpointName, endpointData) || ({} as IResultEndpoint);
    if (!url) {
      throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
    }
    return request<IListData<IAttachment> | IAttachment[]>(`${url}?page_size=all`, {method: 'GET'}).then(
      (response: IListData<IAttachment> | IAttachment[]) => {
        dispatch(new SetAttachmentsList({data: response, name: endpointName}));
      }
    );
  };
}

export function addAttachmentToList(
  endpointName: string,
  endpointData: GenericObject,
  data: Partial<IAttachment>
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(endpointName, endpointData) || ({} as IResultEndpoint);
    if (!url) {
      throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
    }
    dispatch(new SetAttachmentsUpdateState(true));
    return request(`${url}`, {method: 'POST', body: JSON.stringify(data)})
      .then(() => dispatch(new SetAttachmentsUpdateError({})))
      .catch((error: any) => dispatch(new SetAttachmentsUpdateError(error.data)))
      .then(() => {
        dispatch(new SetAttachmentsUpdateState(false));
      });
  };
}

export function updateListAttachment(
  endpointName: string,
  endpointData: GenericObject,
  id: number,
  data: Partial<IAttachment>
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(endpointName, endpointData) || ({} as IResultEndpoint);
    if (!url) {
      throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
    }
    dispatch(new SetAttachmentsUpdateState(true));
    return request(`${url}${id}/`, {method: 'PATCH', body: JSON.stringify(data)})
      .then(() => dispatch(new SetAttachmentsUpdateError({})))
      .catch((error: any) => dispatch(new SetAttachmentsUpdateError(error.data)))
      .then(() => {
        dispatch(new SetAttachmentsUpdateState(false));
      });
  };
}

export function deleteListAttachment(
  endpointName: string,
  endpointData: GenericObject,
  id: number
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(endpointName, endpointData) || ({} as IResultEndpoint);
    if (!url) {
      throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
    }
    dispatch(new SetAttachmentsUpdateState(true));
    return request(`${url}${id}/`, {method: 'DELETE'})
      .then(() => dispatch(new SetAttachmentsUpdateError({})))
      .catch((error: any) => dispatch(new SetAttachmentsUpdateError(error.data)))
      .then(() => {
        dispatch(new SetAttachmentsUpdateState(false));
      });
  };
}
