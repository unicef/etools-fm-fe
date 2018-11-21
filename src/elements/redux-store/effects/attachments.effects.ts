import { Dispatch } from 'redux';
import { AddNotification } from '../actions/notification.actions';
import { request } from '../request';
import { getEndpoint } from '../../app-config/app-config';
import { FinishRequestAttachments, SetAttachments, StartRequestAttachments } from '../actions/attachments.actions';

export function loadAttachments() {
    return function (dispatch: Dispatch) {
        const endpoint = getEndpoint('attachments');
        dispatch(new StartRequestAttachments());
        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification(`Can not Load attachments`));
                return {results: []};
            })
            .then((attachments: IListData<Attachment>) =>  dispatch(new SetAttachments(attachments)))
            .then(() => dispatch(new FinishRequestAttachments()));
    };
}

export function uploadAttachment(data: any) {
    return function (dispatch: Dispatch) {
        const endpoint = getEndpoint('attachments');
        dispatch(new StartRequestAttachments());
        const body = new FormData();
        Object.keys(data).forEach((key) => body.append(key, data[key]));
        const options = {
            method: 'POST',
            body,
            headers: {'Content-Type': 'application/json'}
        };
        return request(endpoint.url, options)
            .catch(() => {
                dispatch(new AddNotification(`Can not upload attachment`));
            })
            .then((attachments: IListData<Attachment>) =>  dispatch(new SetAttachments(attachments)))
            .then(() => dispatch(new FinishRequestAttachments()));
    };
}
