import {IAsyncAction} from '../middleware';
import {DataCollectionChecklistActionTypes} from '../actions/data-collection.actions';
import {getEndpoint} from '../../endpoints/endpoints';
import {DATA_COLLECTION_CHECKLIST, DATA_COLLECTION_OVERALL_FINDING} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {store} from '../store';
import {Dispatch} from 'redux';

export function loadDataCollectionChecklistInfo(activityId: string, checklistId: string): IAsyncAction {
  return {
    types: [
      DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_REQUEST,
      DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_SUCCESS,
      DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(DATA_COLLECTION_CHECKLIST, {activityId});
      const resultUrl: string = `${url}${checklistId}/`;
      return request(resultUrl);
    }
  };
}

/**
 * Allows to load findings and overall findings.
 * You can skip one of these requests to fetch the info that was changed
 */
export function loadFindingsAndOverall(
  activityId: string,
  checklistId: string,
  skip?: 'findings' | 'overall' | null
): IAsyncAction {
  return {
    types: [
      DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_REQUEST,
      DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_SUCCESS,
      DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(DATA_COLLECTION_CHECKLIST, {activityId});
      const findingsUrl: string = `${url}${checklistId}/findings/?page_size=all`;
      const overallUrl: string = `${url}${checklistId}/overall/?page_size=all`;
      return Promise.all([
        skip === 'findings' ? null : request<DataCollectionFinding[]>(findingsUrl),
        skip === 'overall' ? null : request<DataCollectionOverall[]>(overallUrl)
      ]).then(([findings, overall]: [DataCollectionFinding[] | null, DataCollectionOverall[] | null]) => {
        if (findings && overall) {
          return {findings, overall};
        } else if (findings) {
          return {findings};
        } else {
          return {overall};
        }
      });
    }
  };
}

/**
 * Allows to update findings and overall findings.
 * Makes request only if changes was made.
 * Updates saved info in store on successful update
 */
export function updateFindingsAndOverall(
  activityId: string,
  checklistId: string,
  requestData: DataCollectionRequestData
): IAsyncAction {
  return {
    types: [
      DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_REQUEST,
      DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_SUCCESS,
      DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_FAILURE
    ],
    api: () => {
      return Promise.all([
        updateFindings(activityId, checklistId, requestData.findings),
        updateOverall(activityId, checklistId, requestData.overall)
      ]).then(([findings, overall]: [DataCollectionFinding[] | null, DataCollectionOverall | null]) => {
        let skip: 'findings' | 'overall' | null = null;
        if (findings === null) {
          skip = 'findings';
        } else if (overall === null) {
          skip = 'overall';
        }
        store.dispatch<AsyncEffect>(loadFindingsAndOverall(activityId, checklistId, skip));
      });
    }
  };
}

function updateOverall(
  activityId: string,
  checklistId: string,
  overall?: Partial<DataCollectionOverall>
): Promise<DataCollectionOverall> | null {
  const {id, ...requestData} = overall || {};
  if (!id || !Object.keys(requestData).length) {
    return null;
  }
  const {url}: IResultEndpoint = getEndpoint(DATA_COLLECTION_OVERALL_FINDING, {activityId, checklistId, overallId: id});
  return request(url, {method: 'PATCH', body: JSON.stringify(requestData)});
}

function updateFindings(
  activityId: string,
  checklistId: string,
  findings?: Partial<DataCollectionFinding>[]
): Promise<DataCollectionFinding[]> | null {
  if (!findings || !findings.length) {
    return null;
  }
  const {url}: IResultEndpoint = getEndpoint(DATA_COLLECTION_CHECKLIST, {activityId});
  const findingsUrl: string = `${url}${checklistId}/findings/`;
  return request(findingsUrl, {method: 'PATCH', body: JSON.stringify(findings)});
}

export function updateChecklistAttachments(
  url: string,
  data: RequestChecklistAttachment[]
): (dispatch: Dispatch) => Promise<boolean> {
  return () => {
    const requestsData: GenericObject<RequestChecklistAttachment[]> = data.reduce(
      (requests: GenericObject<RequestChecklistAttachment[]>, attachment: RequestChecklistAttachment) => {
        if (attachment.id && !attachment.delete) {
          requests.PATCH.push(attachment);
        } else if (attachment.id) {
          requests.DELETE.push({id: attachment.id});
        } else {
          requests.POST.push(attachment);
        }
        return requests;
      },
      {
        POST: [],
        PATCH: [],
        DELETE: []
      }
    );
    const requests: (Promise<void> | null)[] = Object.entries(requestsData).map(
      ([method, data]: [string, RequestChecklistAttachment[]]) =>
        data.length ? request(url, {method, body: JSON.stringify(data)}) : null
    );
    return Promise.all(requests).then((response: (void | null)[]) =>
      response.every((response: void | null) => response === null)
    );
  };
}
