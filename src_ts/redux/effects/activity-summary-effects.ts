import {IAsyncAction} from '../middleware';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {ACTIVITY_OVERALL_FINDING, DATA_COLLECTION_ACTIVITY} from '../../endpoints/endpoints-list';
import {ActivitySummaryActionTypes} from '../actions/activity-summary-actions';
import {DataCollectionChecklistActionTypes} from '../actions/data-collection.actions';
import {store} from '../store';
import {SetEditedFindingsCard, SetFindingsUpdateState} from '../actions/findings-components.actions';

/**
 * Allows to load findings and overall findings.
 * You can skip one of these requests to fetch the info that was changed
 */
export function loadSummaryFindingsAndOverall(activityId: number, skip?: 'findings' | 'overall' | null): IAsyncAction {
  return {
    types: [
      ActivitySummaryActionTypes.FINDINGS_AND_OVERALL_GET_REQUEST,
      ActivitySummaryActionTypes.FINDINGS_AND_OVERALL_GET_SUCCESS,
      ActivitySummaryActionTypes.FINDINGS_AND_OVERALL_GET_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(DATA_COLLECTION_ACTIVITY, {activityId});
      const findingsUrl = `${url}findings/?page_size=all`;
      const overallUrl = `${url}overall-findings/?page_size=all`;
      return Promise.all([
        skip === 'findings' ? null : request<SummaryFinding[]>(findingsUrl),
        skip === 'overall' ? null : request<SummaryOverall[]>(overallUrl)
      ]).then(([findings, overall]: [SummaryFinding[] | null, SummaryOverall[] | null]) => {
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
export function updateSummaryFindingsAndOverall(
  activityId: number,
  requestData: DataCollectionRequestData<SummaryFinding, SummaryOverall>
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
        updateSummaryFindings(activityId, requestData.findings),
        updateSummaryOverall(activityId, requestData.overall)
      ])
        .then(([findings, overall]: [DataCollectionFinding[] | null, DataCollectionOverall | null]) => {
          let skip: 'findings' | 'overall' | null = null;
          if (findings === null) {
            skip = 'findings';
          } else if (overall === null) {
            skip = 'overall';
          }
          store.dispatch(new SetEditedFindingsCard(null));
          store.dispatch<AsyncEffect>(loadSummaryFindingsAndOverall(activityId, skip));
        })
        .finally(() => {
          store.dispatch(new SetFindingsUpdateState(false));
        });
    }
  };
}

function updateSummaryOverall(activityId: number, overall?: Partial<SummaryOverall>): Promise<SummaryOverall> | null {
  const {id, ...requestData} = overall || {};
  if (!activityId || !id || !Object.keys(requestData).length) {
    return null;
  }
  const {url}: IResultEndpoint = getEndpoint(ACTIVITY_OVERALL_FINDING, {activityId, overallId: id});
  return request(url, {method: 'PATCH', body: JSON.stringify(requestData)});
}

function updateSummaryFindings(
  activityId: number,
  findings?: Partial<SummaryFinding>[]
): Promise<SummaryFinding[]> | null {
  if (!findings || !findings.length) {
    return null;
  }
  const {url}: IResultEndpoint = getEndpoint(DATA_COLLECTION_ACTIVITY, {activityId});
  const findingsUrl = `${url}findings/`;
  return request(findingsUrl, {method: 'PATCH', body: JSON.stringify(findings)});
}
