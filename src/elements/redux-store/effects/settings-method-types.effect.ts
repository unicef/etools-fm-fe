import {
    SetMethodTypesList,
    SetMethodTypeUpdatingError,
    StartMethodTypeUpdating, StopMethodTypeUpdating
} from '../actions/settings-method-types.actions';
import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';

export function loadMethodTypes(queryParams: QueryParams) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('methodTypes') as StaticEndpoint;
        const url = endpoint.url + objectToQuery(queryParams);
        return fetch(url, {method: 'GET'})
            .then(resp => resp.json())
            .then(response => dispatch(new SetMethodTypesList({...response, current: url})));
    };
}

export function updateMethodType(type: MethodType) {
    return function(dispatch: Dispatch) {
        const id = type.id;
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

    const options = {method,  body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}};
    return fetch(url, options)
        .then(() => dispatch(new SetMethodTypeUpdatingError({errors: null})))
        .catch((error) => dispatch(new SetMethodTypeUpdatingError({errors: error.json()})))
        .then(() => dispatch(new StopMethodTypeUpdating()));
}
