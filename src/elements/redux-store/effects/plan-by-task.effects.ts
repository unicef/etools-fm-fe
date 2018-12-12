import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import {
    SetInterventionLocations,
    SetPartnerTasks,
    SetPartnerTasksLoadingState,
    SetTasksList,
    SetTasksUpdatingError,
    StartTasksUpdating,
    StopTasksUpdating
} from '../actions/plan-by-task.actions';

export function loadPlaningTasks(year: number, queryParams: QueryParams = {}) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('planingTasks', {year});
        const url = endpoint.url + objectToQuery(queryParams);
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Planing Tasks'));
                return {results: []};
            })
            .then(response => dispatch(new SetTasksList({...response, current: url})));
    };
}

export function loadPartnerTasks(year: number, queryParams: QueryParams = {}) {
    return function(dispatch: Dispatch) {
        dispatch(new SetPartnerTasksLoadingState(true));
        const endpoint = getEndpoint('planingTasks', {year});
        const url = endpoint.url + objectToQuery({...queryParams, page_size: 'all'});
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Planing Tasks for selected Partner'));
                return [];
            })
            .then(response => dispatch(new SetPartnerTasks(response)))
            .then(() => dispatch(new SetPartnerTasksLoadingState(false)));
    };
}

export function loadInterventionLocations(interventionId: number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('interventionLocations', {interventionId});
        const url = endpoint.url;
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Locations for selected Intervention'));
                return [];
            })
            .then(response => dispatch(new SetInterventionLocations(response)));
    };
}

export function updatePlaningTask(year: number, id: number, task: PlaningTask) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('planingTaskDetails', {year, id});
        return startRequest(dispatch, endpoint.url, 'PATCH', task);
    };
}

export function removePlaningTask(year: number, id: string | number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('planingTaskDetails', {year, id});
        return startRequest(dispatch, endpoint.url, 'DELETE', {});
    };
}

export function addPlaningTask(year: number, task: PlaningTask) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('planingTasks', {year});
        return startRequest(dispatch, endpoint.url, 'POST', task);
    };
}

function startRequest(dispatch: Dispatch, url: string, method: RequestMethod, data: MethodType | {}) {
    dispatch(new StartTasksUpdating());

    const options = {method,  body: JSON.stringify(data)};
    return request(url, options)
        .then(() => dispatch(new SetTasksUpdatingError({errors: null})))
        .catch((error) => dispatch(new SetTasksUpdatingError({errors: error.data})))
        .then(() => dispatch(new StopTasksUpdating()));
}
