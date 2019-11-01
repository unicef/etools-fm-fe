import { Dispatch } from 'redux';
import { getEndpoint } from '../../endpoints/endpoints';
import { ANALYZE_OVERALL_STATISTICS } from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';
import { SetOverallActivities } from '../actions/analyze.actions';

export function loadOverallStatistics(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(ANALYZE_OVERALL_STATISTICS);
    return request<OverallActivities>(endpoint.url, { method: 'GET' })
        .then((response: OverallActivities) => { dispatch(new SetOverallActivities(response)); });
  };
}
