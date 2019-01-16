import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import { SetPlannedTotalInfo, SetVisitsList, SetVisitsTotalInfo } from '../actions/visits.actions';

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

export function loadVisitsTotalInfo() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('visitsTotalInfo');
        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Visits Total Info'));
                return null;
            })
            .then(response => dispatch(new SetVisitsTotalInfo(response)));
    };
}

export function loadPlanedTotal() {
    return function (dispatch: Dispatch) {
        const year = new Date().getFullYear();
        const endpoint = getEndpoint('yearPlan', {year});
        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Planned Total Info'));
                return null;
            })
            .then(response => {
                const totalInfo = response && response.total_planned || null;
                dispatch(new SetPlannedTotalInfo(totalInfo));
            });
    };
}
