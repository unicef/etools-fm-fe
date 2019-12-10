import {IAsyncAction} from '../middleware';
import {
  DataCollectionChecklistActionTypes,
  SetChecklistError,
  SetChecklistInformationSource
} from '../actions/data-collection.actions';
import {getEndpoint} from '../../endpoints/endpoints';
import {
  DATA_COLLECTION_CHECKLIST,
  DATA_COLLECTION_METHODS,
  DATA_COLLECTION_OVERALL_FINDING,
  DATA_COLLECTION_SPECIFIC_CHECKLIST
} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {store} from '../store';
import {Dispatch} from 'redux';
import {SetEditedFindingsCard, SetFindingsUpdateState} from '../actions/findings-components.actions';

export function loadDataCollectionChecklist(activityId: number): IAsyncAction {
  return {
    types: [
      DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_REQUEST,
      DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_SUCCESS,
      DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(DATA_COLLECTION_CHECKLIST, {activityId});
      return request(`${url}?page_size=all`);
    }
  };
}

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

export function updateDataCollectionChecklistInformationSource(
  activityId: string,
  checklistId: string,
  requestData: Partial<DataCollectionChecklist>
): (dispatch: Dispatch) => Promise<void | SetChecklistError> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(DATA_COLLECTION_SPECIFIC_CHECKLIST, {activityId, checklistId});
    return request<DataCollectionChecklist>(endpoint.url, {method: 'PATCH', body: JSON.stringify(requestData)})
      .then((response: DataCollectionChecklist) => {
        dispatch(new SetChecklistInformationSource(response));
      })
      .catch((error: GenericObject) => dispatch(new SetChecklistError(error)));
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
      store.dispatch(new SetFindingsUpdateState(true));
      return Promise.all([
        updateFindings(activityId, checklistId, requestData.findings),
        updateOverall(activityId, checklistId, requestData.overall)
      ])
        .then(([findings, overall]: [DataCollectionFinding[] | null, DataCollectionOverall | null]) => {
          let skip: 'findings' | 'overall' | null = null;
          if (findings === null) {
            skip = 'findings';
          } else if (overall === null) {
            skip = 'overall';
          }
          store.dispatch(new SetEditedFindingsCard(null));
          store.dispatch<AsyncEffect>(loadFindingsAndOverall(activityId, checklistId, skip));
        })
        .finally(() => {
          store.dispatch(new SetFindingsUpdateState(false));
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
      (
        requests: GenericObject<RequestChecklistAttachment[]>,
        {attachment, id, _delete, file_type}: RequestChecklistAttachment
      ) => {
        if (id && !_delete) {
          requests.PATCH.push({file_type});
        } else if (id) {
          requests.DELETE.push({id});
        } else {
          requests.POST.push({id: attachment, file_type});
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
      ([method, data]: [string, RequestChecklistAttachment[]]) => {
        if (!data.length) {
          return null;
        }
        if (method === 'DELETE') {
          const ids: string = data.map(({id}: RequestChecklistAttachment) => id).join(',');
          return request(`${url}?id__in=${ids}`, {method});
        } else if (method === 'POST') {
          return request(`${url}/link/`, {method, body: JSON.stringify(data)});
        } else {
          return request(url, {method, body: JSON.stringify(data)});
        }
      }
    );
    return Promise.all(requests).then((response: (void | null)[]) =>
      response.every((response: void | null) => response === null)
    );
  };
}

export function createCollectionChecklist(id: number, data: Partial<DataCollectionChecklist>): IAsyncAction {
  return {
    types: [
      DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_REQUEST,
      DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_SUCCESS,
      DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_FAILURE
    ],
    api: () => {
      const requestInit: RequestInit = {method: 'POST', body: JSON.stringify(data)};
      const {url}: IResultEndpoint = getEndpoint(DATA_COLLECTION_CHECKLIST, {activityId: id});
      return request(url, requestInit);
    }
  };
}

export function loadDataCollectionMethods(id: number): IAsyncAction {
  return {
    types: [
      DataCollectionChecklistActionTypes.DATA_COLLECTION_METHODS_REQUEST,
      DataCollectionChecklistActionTypes.DATA_COLLECTION_METHODS_SUCCESS,
      DataCollectionChecklistActionTypes.DATA_COLLECTION_METHODS_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(DATA_COLLECTION_METHODS, {activityId: id});
      return request<EtoolsMethod[]>(url, {method: 'GET'}).then((methods: EtoolsMethod[]) => ({
        methods,
        forActivity: id
      }));
    }
  };
}
