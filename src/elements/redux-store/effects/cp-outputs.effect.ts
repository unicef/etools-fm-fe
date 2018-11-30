import {
    FinishRequestCpOutput,
    SetCpOutputs,
    SetRequestErrorCpOutput,
    StartRequestCpOutput
} from '../actions/cp-outputs.actions';
import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import { ResetStaticData } from '../actions/static-data.actions';

export function loadCpOutputs(queryParams: QueryParams) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('cpOutputs');
        const url = endpoint.url + objectToQuery(queryParams);
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load CP Outputs'));
                return {results: []};
            })
            .then(response => dispatch(new SetCpOutputs(response)));
    };
}

export function loadCpOutputsConfigs() {
    return function(dispatch: Dispatch) {
        const {url} = getEndpoint('cpOutputsConfigs');
        return request(`${url}?is_monitored=true`, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load CP Outputs Configs'));
                return {results: []};
            })
            .then(response => {
                dispatch(new ResetStaticData('cpOutputsConfigs', response.results));
            });
    };
}

export function updateCpOutput(id: number, cpOutput: CpOutput) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('cpOutputDetails', {id});
        const options = {
            method: 'PATCH',
            body: JSON.stringify(cpOutput),
            headers: {'Content-Type': 'application/json'}
        };
        dispatch(new StartRequestCpOutput());
        return request(endpoint.url, options)
            .then(() => dispatch(new SetRequestErrorCpOutput({errors: null})))
            .catch((error) => dispatch(new SetRequestErrorCpOutput({errors: error.data})))
            .then(() => dispatch(new FinishRequestCpOutput()));
    };
}
