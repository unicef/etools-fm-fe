import { SetCpOutputs } from '../actions/cp-outputs.actions';
import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';

export function loadCpOutputs(queryParams: {}) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('cpOutputs') as StaticEndpoint;
        const url = endpoint.url + objectToQuery(queryParams);
        return fetch(url, {method: 'GET'})
            .then(resp => resp.json())
            .then(response => dispatch(new SetCpOutputs(response)));
    };
}
