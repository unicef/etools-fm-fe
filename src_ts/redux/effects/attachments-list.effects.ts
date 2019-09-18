import { Dispatch } from 'redux';
import { getEndpoint } from '../../endpoints/endpoints';
import { request } from '../../endpoints/request';
import {
    SetAttachmentsList,
    SetAttachmentsUpdateError,
    SetAttachmentsUpdateState
} from '../actions/attachments-list.actions';

export function loadAttachmentsList(endpointName: string): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const { url }: IResultEndpoint = getEndpoint(endpointName) || {} as IResultEndpoint;
        if (!url) {
            throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
        }
        return request<IListData<Attachment> | Attachment[]>(url, { method: 'GET' })
            .then((response: IListData<Attachment> | Attachment[]) => {
                dispatch(new SetAttachmentsList({ data: response, name: endpointName }));
            });
    };
}

export function addAttachmentToList(endpointName: string, data: Partial<Attachment>): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const { url }: IResultEndpoint = getEndpoint(endpointName) || {} as IResultEndpoint;
        if (!url) {
            throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
        }
        dispatch(new SetAttachmentsUpdateState(true));
        const body: FormData = jsonToFormData(data);
        return request(url, { method: 'POST', body })
            .then(() => dispatch(new SetAttachmentsUpdateError({})))
            .catch((error: any) => dispatch(new SetAttachmentsUpdateError(error.data)))
            .then(() => { dispatch(new SetAttachmentsUpdateState(false)); });
    };
}

export function updateListAttachment(endpointName: string, id: number, data: Partial<Attachment>): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const { url }: IResultEndpoint = getEndpoint(endpointName) || {} as IResultEndpoint;
        if (!url) {
            throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
        }
        dispatch(new SetAttachmentsUpdateState(true));
        const body: FormData = jsonToFormData(data);
        return request(`${url}${id}/`, { method: 'PATCH', body })
            .then(() => dispatch(new SetAttachmentsUpdateError({})))
            .catch((error: any) => dispatch(new SetAttachmentsUpdateError(error.data)))
            .then(() => { dispatch(new SetAttachmentsUpdateState(false)); });
    };
}

export function deleteListAttachment(endpointName: string, id: number): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const { url }: IResultEndpoint = getEndpoint(endpointName) || {} as IResultEndpoint;
        if (!url) {
            throw new Error(`Provided endpoint name (${endpointName}) is not found in endpoint list`);
        }
        dispatch(new SetAttachmentsUpdateState(true));
        return request(`${url}${id}/`, { method: 'DELETE' })
            .then(() => dispatch(new SetAttachmentsUpdateError({})))
            .catch((error: any) => dispatch(new SetAttachmentsUpdateError(error.data)))
            .then(() => { dispatch(new SetAttachmentsUpdateState(false)); });
    };
}

function jsonToFormData(json: GenericObject): FormData {
    const body: FormData = new FormData();
    Object.keys(json).forEach((key: string) => { body.append(key, json[key]); });
    return body;
}
