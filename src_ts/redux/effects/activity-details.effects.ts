import { IAsyncAction } from '../middleware';
import { getEndpoint } from '../../endpoints/endpoints';
import { ACTIVITY_DETAILS } from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';
import { ActivityDetailsActions } from '../actions/activity-details.actions';

export function requestActivityDetails(id: number): IAsyncAction {
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
