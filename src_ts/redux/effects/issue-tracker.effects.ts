import {IAsyncAction} from '../middleware';
import {getEndpoint} from '../../endpoints/endpoints';
import {LOG_ISSUES, LOG_ISSUES_ATTACHMENTS, LOG_ISSUES_DETAILS} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {IssueTrackerActions} from '../actions/issue-tracker.actions';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {EtoolsRouteQueryParams} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

export function requestLogIssue(params: EtoolsRouteQueryParams): IAsyncAction {
  return {
    types: [
      IssueTrackerActions.ISSUE_TRACKER_DATA_REQUEST,
      IssueTrackerActions.ISSUE_TRACKER_DATA_SUCCESS,
      IssueTrackerActions.ISSUE_TRACKER_DATA_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(LOG_ISSUES);
      const resultUrl = `${url}?${EtoolsRouter.encodeQueryParams(params)}`;
      return request(resultUrl);
    }
  };
}

export function createLogIssue(issue: Partial<LogIssue>, files: IAttachment[]): IAsyncAction {
  return {
    types: [
      IssueTrackerActions.ISSUE_TRACKER_UPDATE_REQUEST,
      IssueTrackerActions.ISSUE_TRACKER_UPDATE_SUCCESS,
      IssueTrackerActions.ISSUE_TRACKER_UPDATE_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(LOG_ISSUES);
      const options: RequestInit = {
        method: 'POST',
        body: JSON.stringify(issue),
        headers: {'Content-Type': 'application/json'}
      };
      return request(url, options).then((response: any) => {
        const id: number = response.id;
        return updateAttachment(id, files);
      });
    }
  };
}

export function updateLogIssue(issueId: number, issue: Partial<LogIssue>, attachments: IAttachment[]): IAsyncAction {
  return {
    types: [
      IssueTrackerActions.ISSUE_TRACKER_UPDATE_REQUEST,
      IssueTrackerActions.ISSUE_TRACKER_UPDATE_SUCCESS,
      IssueTrackerActions.ISSUE_TRACKER_UPDATE_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(LOG_ISSUES_DETAILS, {id: issueId});
      const options: RequestInit = {
        method: 'PATCH',
        body: JSON.stringify(issue),
        headers: {'Content-Type': 'application/json'}
      };
      return request(url, options).then(() => {
        return updateAttachment(issueId, attachments);
      });
    }
  };
}

function updateAttachment(logIssueId: number, attachments: IAttachment[]): Promise<any> {
  const endpoint: IResultEndpoint = getEndpoint(LOG_ISSUES_ATTACHMENTS, {
    id: logIssueId
  });
  const data: {id: number}[] = attachments.map((attachment: IAttachment) => ({id: attachment.id}));
  const options: RequestInit = {
    method: 'PUT',
    body: JSON.stringify(data)
  };
  return request(endpoint.url, options);
}
