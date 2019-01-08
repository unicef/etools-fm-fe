import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import { SetVisitsList } from '../actions/visits.actions';

export function loadVisitsList(queryParams: QueryParams = {}) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('visits');
        const url = endpoint.url + objectToQuery(queryParams);
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Visits List'));
                return {results: []};
            })
            .then(response => dispatch(new SetVisitsList(response)));
    };
}
