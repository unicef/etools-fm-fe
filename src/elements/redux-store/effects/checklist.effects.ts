import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import {
    SetChecklistCategories,
    SetChecklistCpOutputs,
    SetChecklistItems,
    SetChecklistMethodTypes
} from '../actions/checklist.actions';

export function loadChecklistCpOutputs(outcomeId: number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('cpOutputsConfigs');
        const url = `${endpoint.url}?cp_output__parent=${outcomeId}&page_size=all`;
        return request(url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load CP Outputs'));
                return {results: []};
            })
            .then(response => dispatch(new SetChecklistCpOutputs(response)));
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
        const url = `${endpoint.url}?page_size=all`;
        return request(url, {method: 'GET'})
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
