import { IAsyncAction } from '../middleware';
import { DataCollectionChecklistActionTypes } from '../actions/data-collection.actions';
import { getEndpoint } from '../../endpoints/endpoints';
import { DATA_COLLECTION_CHECKLIST } from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';

export function loadDataCollectionChecklistInfo(activityId: string, checklistId: string): IAsyncAction {
    return {
        types: [
            DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_REQUEST,
            DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_SUCCESS,
            DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE
        ],
        api: () => {
            const { url }: IResultEndpoint = getEndpoint(DATA_COLLECTION_CHECKLIST, { activityId });
            const resultUrl: string = `${ url }${ checklistId }/`;
            return request(resultUrl);
        }
    };
}
