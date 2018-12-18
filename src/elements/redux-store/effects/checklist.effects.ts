import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import {
    FinishRequestChecklistConfig,
    SetChecklistCategories,
    SetChecklistCpOutputsConfigs,
    SetChecklistItems,
    SetChecklistMethodTypes, SetChecklistPlaned,
    SetRequestErrorChecklistConfig,
    StartRequestChecklistConfig,
    UpdateChecklistConfig, UpdateChecklistPlaned
} from '../actions/checklist.actions';

export function loadChecklistCpOutputsConfigs() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('cpOutputsConfigs');
        const url = `${endpoint.url}?page_size=all`;
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load CP Outputs'));
                return {results: []};
            })
            .then(response => dispatch(new SetChecklistCpOutputsConfigs(response)));
    };
}

export function loadChecklistCategories() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('checklistCategories');
        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load CP Outputs'));
                return {results: []};
            })
            .then(response => dispatch(new SetChecklistCategories(response)));
    };
}

export function loadChecklistItems() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('checklistItems');
        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load CP Outputs'));
                return {results: []};
            })
            .then(response => dispatch(new SetChecklistItems(response)));
    };
}

export function loadChecklistMethodTypes() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('methodTypes') as StaticEndpoint;
        const url = endpoint.url + '?page_size=all';
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Method Types'));
                return {results: []};
            })
            .then(response => dispatch(new SetChecklistMethodTypes(response)));
    };
}

export function updateChecklistCpOutputConfig(id: number, cpOutputConfig: CpOutputConfig) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('cpOutputsConfigsDetails', {id});
        const options = {
            method: 'PATCH',
            body: JSON.stringify(cpOutputConfig),
            headers: {'Content-Type': 'application/json'}
        };
        dispatch(new StartRequestChecklistConfig());
        return request(endpoint.url, options)
            .then((response) => dispatch(new UpdateChecklistConfig(response)))
            .then(() => dispatch(new SetRequestErrorChecklistConfig({errors: null})))
            .catch((error) => dispatch(new SetRequestErrorChecklistConfig({errors: error.data})))
            .then(() => dispatch(new FinishRequestChecklistConfig()));
    };
}

export function updateChecklistPlaned(id: number, configId: number, data: ChecklistPlanedItem) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('checklistPlanedDetails', {id, config_id: configId});
        const options = {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        dispatch(new StartRequestChecklistConfig());
        return request(endpoint.url, options)
            .then((response) => dispatch(new UpdateChecklistPlaned(response)))
            // .then(() => dispatch(new SetRequestErrorChecklistConfig({errors: null})))
            // .catch((error) => dispatch(new SetRequestErrorChecklistConfig({errors: error.data})))
            .then(() => dispatch(new FinishRequestChecklistConfig()));
    };
}

export function loadPlanedChecklist(id: number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('checklistPlaned', {config_id: id}) as StaticEndpoint;
        const url = endpoint.url + '?page_size=all';
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Planed Checklist Items'));
                return {results: []};
            })
            .then(response => {
                dispatch(new SetChecklistPlaned(response));
                return response;
            });
    };
}
