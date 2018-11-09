import {
    FinishRequestCpOutput,
    SetCpOutputs,
    SetRequestErrorCpOutput,
    StartRequestCpOutput
} from '../actions/cp-outputs.actions';
import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';

export function loadCpOutputs(queryParams: QueryParams) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('cpOutputs') as StaticEndpoint;
        const url = endpoint.url + objectToQuery(queryParams);
        return fetch(url, {method: 'GET'})
            .then(resp => resp.json())
            .then(response => dispatch(new SetCpOutputs(response)));
    };
}

export function updateCpOutput(cpOutput: CpOutput) {
    return function(dispatch: Dispatch) {
        const id = cpOutput.id;
        const endpoint = getEndpoint('cpOutputDetails', {id});
        const options = {
            method: 'PATCH',
            body: JSON.stringify(cpOutput),
            headers: {'Content-Type': 'application/json'}
        };
        dispatch(new StartRequestCpOutput());
        return fetch(endpoint.url, options)
            .then(() => dispatch(new SetRequestErrorCpOutput({errors: null})))
            .catch((error) => dispatch(new SetRequestErrorCpOutput({errors: error.json()})))
            .then(() => dispatch(new FinishRequestCpOutput()));
    };
}
