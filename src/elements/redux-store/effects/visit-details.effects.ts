import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import {
    SetVisitData, SetVisitOptions, StartVisitDetailsLoading,
    StartVisitOptionsLoading, StopVisitDetailsLoading
} from '../actions/visit-details.actions';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';

export function loadVisitDetails(visitId: number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('visitDetails', {visitId});
        dispatch(new StartVisitDetailsLoading());

        // @ts-ignore
        return dispatch(updateVisitOptions(visitId))
            .then(() => request(endpoint.url, {method: 'GET'}))
            .then((visit: Visit) => dispatch(new SetVisitData(visit)))
            .then(() => dispatch(new StopVisitDetailsLoading()))
            .catch((error: Error) => {
                dispatch(new AddNotification('Can not load visit details'));
                return Promise.reject(error);
            });
    };
}

export function updateVisitOptions(visitId: number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('visitDetails', {visitId});
        dispatch(new StartVisitOptionsLoading());

        return request(endpoint.url, {method: 'OPTIONS'})
            .then((permissions) => dispatch(new SetVisitOptions(permissions)))
            .catch(() => dispatch(new AddNotification(`Can not Load permissions for visit ${visitId}`)))
            .then(() => dispatch(new StartVisitOptionsLoading()));
    };
}