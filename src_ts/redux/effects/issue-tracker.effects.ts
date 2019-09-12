import { IAsyncAction } from '../middleware';
import { getEndpoint } from '../../endpoints/endpoints';
import { LOG_ISSUES, LOG_ISSUES_ATTACHMENTS, LOG_ISSUES_DETAILS } from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';
import { IssueTrackerActions } from '../actions/issue-tracker.actions';
import { EtoolsRouter } from '../../routing/routes';

export function requestLogIssue(params: IRouteQueryParams): IAsyncAction {
    return {
        types: [
            IssueTrackerActions.ISSUE_TRACKER_DATA_REQUEST,
            IssueTrackerActions.ISSUE_TRACKER_DATA_SUCCESS,
            IssueTrackerActions.ISSUE_TRACKER_DATA_FAILURE
        ],
        api: () => {
            const { url }: IResultEndpoint = getEndpoint(LOG_ISSUES);
            const resultUrl: string = `${url}?${EtoolsRouter.encodeParams(params)}`;
            return request(resultUrl);
        }
    };
}

export function createLogIssue(issue: Partial<LogIssue>, files: Attachment[]): IAsyncAction {
    return {
        types: [
            IssueTrackerActions.ISSUE_TRACKER_UPDATE_REQUEST,
            IssueTrackerActions.ISSUE_TRACKER_UPDATE_SUCCESS,
            IssueTrackerActions.ISSUE_TRACKER_UPDATE_FAILURE
        ],
        api: () => {
            const { url }: IResultEndpoint = getEndpoint(LOG_ISSUES);
            const options: RequestInit = {
                method: 'POST',
                body: JSON.stringify(issue),
                headers: { 'Content-Type': 'application/json' }
            };
            return request(url, options)
                .then((response: any) => {
                    const id: number = response.id;
                    const promises: Promise<void>[] = [];
                    files.forEach((file: Attachment) => promises.push(addAttachment(id, file)));
                        // .catch(() => dispatch(new AddNotification('Can not upload attachment')))));
                    return Promise.all(promises);
                });
        }
    };
}

export function updateLogIssue(issueId: number, issue: Partial<LogIssue>,
                               newAttachments: Attachment[] = [],
                               deletedAttachments: Attachment[] = [],
                               changedAttachments: Attachment[] = []): IAsyncAction {
    return {
        types: [
            IssueTrackerActions.ISSUE_TRACKER_UPDATE_REQUEST,
            IssueTrackerActions.ISSUE_TRACKER_UPDATE_SUCCESS,
            IssueTrackerActions.ISSUE_TRACKER_UPDATE_FAILURE
        ],
        api: () => {
            const { url }: IResultEndpoint = getEndpoint(LOG_ISSUES_DETAILS, { id: issueId });
            const options: RequestInit = {
                method: 'PATCH',
                body: JSON.stringify(issue),
                headers: { 'Content-Type': 'application/json' }
            };
            return request(url, options)
                .then(() => {
                    const promises: Promise<void>[] = [];
                    changedAttachments
                        .forEach((changedFile: Attachment) => promises.push(updateAttachment(issueId, changedFile)));
                    deletedAttachments
                        .forEach((deletedFile: Attachment) => promises.push(deleteAttachment(issueId, deletedFile)));
                    newAttachments
                        .forEach((newFile: Attachment) => promises.push(addAttachment(issueId, newFile)));
                    return Promise.all(promises);
                });
        }
    };
}

function addAttachment(logIssueId: number, file: Attachment): Promise<any> {
    const { url }: IResultEndpoint = getEndpoint(LOG_ISSUES_ATTACHMENTS, { id: logIssueId });
    const body: FormData = jsonToFormData(file);
    const options: RequestInit = {
        method: 'POST',
        body
    };
    return request(url, options);
}

function updateAttachment(logIssueId: number, file: Attachment): Promise<any> {
    if (!file || !file.id) { throw new Error('Incorrect file for update'); }
    const endpoint: IResultEndpoint = getEndpoint('logIssuesAttachmentsDetails', {
        logIssueId,
        attachmentId: file.id
    });
    const data: any = { file: file.file };
    const body: FormData = jsonToFormData(data);
    const options: RequestInit = {
        method: 'PATCH',
        body
    };
    return request(endpoint.url, options);
}

function deleteAttachment(logIssueId: number, file: Attachment): Promise<any> {
    if (!file || !file.id) { throw new Error('Incorrect file for deleting'); }
    const endpoint: IResultEndpoint = getEndpoint('logIssuesAttachmentsDetails', {
        logIssueId,
        attachmentId: file.id
    });
    const options: RequestInit = {
        method: 'DELETE'
    };
    return request(endpoint.url, options);
}

function jsonToFormData(json: any): FormData {
    const body: FormData = new FormData();
    Object.keys(json).forEach((key: string) => { body.append(key, json[key]); });
    return body;
}
