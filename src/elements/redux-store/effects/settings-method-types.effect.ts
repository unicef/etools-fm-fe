import {
    SetMethodTypesList,
    SetMethodTypeUpdatingError,
    StartMethodTypeUpdating, StopMethodTypeUpdating
} from '../actions/settings-method-types.actions';
import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';

export function loadMethodTypes(queryParams: QueryParams) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('methodTypes') as StaticEndpoint;
        const url = endpoint.url + objectToQuery(queryParams);
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Method Types'));
                return {results: []};
            })
            .then(response => dispatch(new SetMethodTypesList({...response, current: url})));
    };
}

export function updateMethodType(id: number, type: MethodType) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('methodTypeDetails', {id});
        return startRequest(dispatch, endpoint.url, 'PATCH', type);
    };
}

export function removeMethodType(id: string | number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('methodTypeDetails', {id});
        return startRequest(dispatch, endpoint.url, 'DELETE', {});
    };
}

export function addMethodType(type: MethodType) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('methodTypes');
        return startRequest(dispatch, endpoint.url, 'POST', type);
    };
}

function startRequest(dispatch: Dispatch, url: string, method: RequestMethod, data: MethodType | {}) {
    dispatch(new StartMethodTypeUpdating());

    const options = {method,  body: JSON.stringify(data)};
    return request(url, options)
        .then(() => dispatch(new SetMethodTypeUpdatingError({errors: null})))
        .catch((errors) => dispatch(new SetMethodTypeUpdatingError({errors})))
        .then(() => dispatch(new StopMethodTypeUpdating()));
}
