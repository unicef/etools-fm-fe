import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import {
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
