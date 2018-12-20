import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import {
    FinishRequestChecklist,
    SetChecklistCpOutputsConfigs,
    SetChecklistMethodTypes, SetChecklistPlaned,
    SetRequestErrorChecklistConfig,
    StartRequestChecklist,
    UpdateChecklistConfig, UpdateChecklistPlaned
} from '../actions/checklist.actions';

export function loadChecklistCpOutputsConfigs() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('cpOutputsConfigs');
        const url = `${endpoint.url}?page_size=all`;
        dispatch(new StartRequestChecklist());
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load CP Outputs'));
                return {results: []};
            })
            .then(response => dispatch(new SetChecklistCpOutputsConfigs(response)))
            .then(() => dispatch(new FinishRequestChecklist()));
    };
}

export function loadChecklistMethodTypes() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('methodTypes');
        const url = endpoint.url + '?page_size=all';
        dispatch(new StartRequestChecklist());
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Method Types'));
                return {results: []};
            })
            .then(response => dispatch(new SetChecklistMethodTypes(response)))
            .then(() => dispatch(new FinishRequestChecklist()));
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
        dispatch(new StartRequestChecklist());
        return request(endpoint.url, options)
            .then((response) => dispatch(new UpdateChecklistConfig(response)))
            .then(() => dispatch(new SetRequestErrorChecklistConfig({errors: null})))
            .catch((error) => dispatch(new SetRequestErrorChecklistConfig({errors: error.data})))
            .then(() => dispatch(new FinishRequestChecklist()));
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
        dispatch(new StartRequestChecklist());
        return request(endpoint.url, options)
            .then((response) => dispatch(new UpdateChecklistPlaned(response)))
            // .then(() => dispatch(new SetRequestErrorChecklistConfig({errors: null})))
            // .catch((error) => dispatch(new SetRequestErrorChecklistConfig({errors: error.data})))
            .then(() => dispatch(new FinishRequestChecklist()));
    };
}

export function loadPlanedChecklist(id: number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('checklistPlaned', {config_id: id});
        const url = endpoint.url + '?page_size=all';
        dispatch(new StartRequestChecklist());
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Planed Checklist Items'));
                return {results: []};
            })
            .then(response => {
                dispatch(new SetChecklistPlaned(response));
                return response;
            })
            .then(() => dispatch(new FinishRequestChecklist()));
    };
}
