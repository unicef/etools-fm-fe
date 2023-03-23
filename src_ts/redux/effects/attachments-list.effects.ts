import {Dispatch} from 'redux';
import {getChoices} from '../../components/utils/utils';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {
  SetAttachmentsList,
  SetAttachmentsOptions,
  SetAttachmentsTypes,
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

export function loadAttachmentsTypes(
  endpointName: string,
  endpointData: GenericObject
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(endpointName, endpointData) || ({} as IResultEndpoint);
    if (!url) {
      throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
    }
    return request<AttachmentType[]>(`${url}file-types?page_size=all`, {method: 'GET'}).then(
      (response: AttachmentType[]) => {
        dispatch(new SetAttachmentsTypes({name: endpointName, data: response}));
      }
    );
  };
}

export function loadAttachmentsListWithOptions(
  endpointName: string,
  endpointData: GenericObject
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(endpointName, endpointData) || ({} as IResultEndpoint);
    if (!url) {
      throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
    }
    return Promise.all([
      request<IListData<IAttachment> | IAttachment[]>(`${url}?page_size=all`, {method: 'GET'}),
      request<IListData<IAttachment> | IAttachment[]>(`${url}`, {method: 'OPTIONS'})
    ]).then((response: [IListData<IAttachment> | IAttachment[], any]) => {
      dispatch(new SetAttachmentsList({data: response[0], name: endpointName}));
      const types = (getChoices(response[1], 'file_type') || []).map((x: any) => {
        return {id: x.value, label: x.display_name};
      });
      dispatch(new SetAttachmentsTypes({name: endpointName, data: types}));
      dispatch(new SetAttachmentsOptions(response[1]));
    });
  };
}

export function addAttachmentToList(
  endpointName: string,
  endpointData: GenericObject,
  data: Partial<IAttachment> | FormData,
  stringify = true
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(endpointName, endpointData) || ({} as IResultEndpoint);
    if (!url) {
      throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
    }
    dispatch(new SetAttachmentsUpdateState(true));
    return request(`${url}`, {method: 'POST', body: (stringify ? JSON.stringify(data) : data) as any})
      .then(() => dispatch(new SetAttachmentsUpdateError({})))
      .catch((error: any) => {
        console.log('addAttachmentToList', error);
        dispatch(new SetAttachmentsUpdateError(error.data));
      })
      .then(() => {
        dispatch(new SetAttachmentsUpdateState(false));
      });
  };
}

export function updateListAttachment(
  endpointName: string,
  endpointData: GenericObject,
  id: number,
  data: Partial<IAttachment> | FormData,
  stringify = true
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(endpointName, endpointData) || ({} as IResultEndpoint);
    if (!url) {
      throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
    }
    dispatch(new SetAttachmentsUpdateState(true));
    return request(`${url}${id}/`, {method: 'PATCH', body: (stringify ? JSON.stringify(data) : data) as any})
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
