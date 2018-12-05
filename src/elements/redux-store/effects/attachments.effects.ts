import { Dispatch } from 'redux';
import { AddNotification } from '../actions/notification.actions';
import { request } from '../request';
import { getEndpoint, jsonToFormData } from '../../app-config/app-config';
import {
    FinishRequestAttachments,
    SetAttachments,
    StartRequestAttachments
} from '../actions/attachments.actions';

export function loadAttachments() {
    return function (dispatch: Dispatch) {
        const endpoint = getEndpoint('attachments');
        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification(`Can not Load attachments`));
                return {results: []};
            })
            .then((attachments: IListData<Attachment>) =>  dispatch(new SetAttachments(attachments)));
    };
}

export function addAttachment(data: any) {
    return function (dispatch: Dispatch) {
        const endpoint = getEndpoint('attachments');
        dispatch(new StartRequestAttachments());
        const body = jsonToFormData(data);
        const options = {
            method: 'POST',
            body
        };
        return request(endpoint.url, options)
            .catch(() => {
                dispatch(new AddNotification(`Can not upload attachment`));
            })
            .then(() => dispatch(new FinishRequestAttachments()));
    };
}

export function updateAttachment(id: number, data: any) {
    return function (dispatch: Dispatch) {
        const endpoint = getEndpoint('attachmentsDetails', {id});
        dispatch(new StartRequestAttachments());
        const body = jsonToFormData(data);
        const options = {
            method: 'PATCH',
            body
        };
        return request(endpoint.url, options)
            .catch(() => {
                dispatch(new AddNotification(`Can not update attachment`));
            })
            .then(() => dispatch(new FinishRequestAttachments()));
    };
}

export function deleteAttachment(id: number) {
    return function (dispatch: Dispatch) {
        if (!id) { throw new Error('Incorrect attachment for deleting'); }
        const endpoint = getEndpoint('attachmentsDetails', {id});
        const options = {
            method: 'DELETE'
        };
        dispatch(new StartRequestAttachments());
        return request(endpoint.url, options)
            .catch(() => {
                dispatch(new AddNotification(`Can not delete attachment`));
            })
            .then(() => dispatch(new FinishRequestAttachments()));
    };
}