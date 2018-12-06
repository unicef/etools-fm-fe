import { Dispatch } from 'redux';
import { getEndpoint, jsonToFormData, objectToQuery } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import {
    FinishRequestLogIssues,
    SetLogIssues, SetRequestErrorLogIssues,
    StartRequestLogIssues
} from '../actions/log-issues.actions';

export function loadLogIssues(queryParams: QueryParams) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('logIssues');
        const url = endpoint.url + objectToQuery(queryParams);
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Log Issues'));
                return {results: []};
            })
            .then(response => dispatch(new SetLogIssues(response)));
    };
}

export function createLogIssue(issue: LogIssue, files: Attachment[]) {
    return function(dispatch: Dispatch) {
        const endpointLogIssue = getEndpoint('logIssues');
        const options = {
            method: 'POST',
            body: JSON.stringify(issue),
            headers: {'Content-Type': 'application/json'}
        };
        dispatch(new StartRequestLogIssues());
        return request(endpointLogIssue.url, options)
            .then(response => {
                const id = response.id;
                const promises: Promise<void>[] = [];
                files.forEach(file => promises.push(addAttachment(id, file)));
                // for (const file of files) {
                //     promises.push(uploadLogIssueAttachment(id, file));
                // }
                return Promise.all(promises);
            })
            .then(() => dispatch(new SetRequestErrorLogIssues({errors: null})))
            .catch((errors) => dispatch(new SetRequestErrorLogIssues({errors: errors.data})))
            .then(() => dispatch(new FinishRequestLogIssues()));
    };
}

export function updateLogIssue(logIssueId: number, issue: LogIssue,
                               newAttachments: Attachment[] = [],
                               deletedAttachments: Attachment[] = [],
                               changedAttachments: Attachment[] = []) {
    return function(dispatch: Dispatch) {
        const endpointLogIssue = getEndpoint('logIssuesDetails', {id: logIssueId});
        const options = {
            method: 'PATCH',
            body: JSON.stringify(issue),
            headers: {'Content-Type': 'application/json'}
        };
        dispatch(new StartRequestLogIssues());
        return request(endpointLogIssue.url, options)
            .then(() => {
                const promises: Promise<void>[] = [];
                changedAttachments.forEach(changedFile => promises.push(updateAttachment(logIssueId, changedFile)
                    .catch(() => dispatch(new AddNotification('Can not update attachment')))));
                deletedAttachments.forEach(deletedFile => promises.push(deleteAttachment(logIssueId, deletedFile)
                    .catch(() => dispatch(new AddNotification('Can not delete attachment')))));
                newAttachments.forEach(newFile => promises.push(addAttachment(logIssueId, newFile)
                    .catch(() => dispatch(new AddNotification('Can not upload attachment')))));
                return Promise.all(promises);
            })
            .then(() => dispatch(new SetRequestErrorLogIssues({errors: null})))
            .catch((errors) => dispatch(new SetRequestErrorLogIssues({errors: errors.data})))
            .then(() => dispatch(new FinishRequestLogIssues()));
    };
}

function addAttachment(logIssueId: number, file: Attachment) {
    const endpoint = getEndpoint('logIssuesAttachments', {id: logIssueId});
    const body = jsonToFormData(file);
    const options = {
        method: 'POST',
        body
    };
    return request(endpoint.url, options);
}

function updateAttachment(logIssueId: number, file: Attachment) {
    if (!file || !file.id) { throw new Error('Incorrect file for update'); }
    const endpoint = getEndpoint('logIssuesAttachmentsDetails', {
        logIssueId,
        attachmentId: file.id
    });
    const data = { file: file.file };
    const body = jsonToFormData(data);
    const options = {
        method: 'PATCH',
        body
    };
    return request(endpoint.url, options);
}

function deleteAttachment(logIssueId: number, file: Attachment) {
    if (!file || !file.id) { throw new Error('Incorrect file for deleting'); }
    const endpoint = getEndpoint('logIssuesAttachmentsDetails', {
        logIssueId,
        attachmentId: file.id
    });
    const options = {
        method: 'DELETE'
    };
    return request(endpoint.url, options);
}
