import { IAsyncAction } from '../middleware';
import { getEndpoint } from '../../endpoints/endpoints';
import { ACTIVITY_DETAILS } from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';
import { ActivityDetailsActions } from '../actions/activity-details.actions';
import { ActivityStatus } from '../../components/pages/activities-and-data-collection/activity-item/statuses-actions/activity-statuses';

export function requestActivityDetails(id: string): IAsyncAction {
    return {
        types: [
            ActivityDetailsActions.ACTIVITY_DETAILS_GET_REQUEST,
            ActivityDetailsActions.ACTIVITY_DETAILS_GET_SUCCESS,
            ActivityDetailsActions.ACTIVITY_DETAILS_GET_FAILURE
        ],
        api: () => {
            const { url }: IResultEndpoint = getEndpoint(ACTIVITY_DETAILS, { id });
            const resultUrl: string = `${url}`;
            return request(resultUrl);
        }
    };
}

export function updateActivityDetails(id: number, activityDetails: Partial<IActivityDetails>): IAsyncAction {
    return {
        types: [
            ActivityDetailsActions.ACTIVITY_DETAILS_UPDATE_REQUEST,
            ActivityDetailsActions.ACTIVITY_DETAILS_UPDATE_SUCCESS,
            ActivityDetailsActions.ACTIVITY_DETAILS_UPDATE_FAILURE
        ],
        api: () => {
            const { url }: IResultEndpoint = getEndpoint(ACTIVITY_DETAILS, { id });
            const options: RequestInit = {
                method: 'PATCH',
                body: JSON.stringify(activityDetails)
            };
            return request(url, options);
        }
    };
}

export function changeActivityStatus(id: number, status: ActivityStatus): IAsyncAction {
    return {
        types: [
            ActivityDetailsActions.ACTIVITY_STATUS_CHANGE_REQUEST,
            ActivityDetailsActions.ACTIVITY_STATUS_CHANGE_SUCCESS,
            ActivityDetailsActions.ACTIVITY_STATUS_CHANGE_FAILURE
        ],
        api: () => {
            const { url }: IResultEndpoint = getEndpoint(ACTIVITY_DETAILS, { id });
            const options: RequestInit = {
                method: 'PATCH',
                body: JSON.stringify({ status })
            };
            return request(url, options);
        }
    };
}
