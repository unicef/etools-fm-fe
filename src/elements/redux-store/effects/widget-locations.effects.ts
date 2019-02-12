import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import {
    SaveLocationPath,
    SaveWidgetLocations, StartLocationPathLoading,
    StartWidgetLocationsLoading, StopLocationPathLoading,
    StopWidgetLocationsLoading
} from '../actions/widget-locations.actions';

export function loadWidgetLocations(queryParams: string) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('widgetLocations');
        const url = `${endpoint.url}${queryParams}`;
        dispatch(new StartWidgetLocationsLoading());

        return request(url, {method: 'GET'})
            .then(response => dispatch(new SaveWidgetLocations(response, queryParams)))
            .catch(() => {
                dispatch(new AddNotification('Can not Load Locations for Widget'));
                return {results: []};
            })
            .then(() => dispatch(new StopWidgetLocationsLoading()));
    };
}

export function loadLocationPath(id: string) {
    return function (dispatch: Dispatch) {
        const endpoint = getEndpoint('widgetLocationPath', {id});
        dispatch(new StartLocationPathLoading());

        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load Location path'));
                return [];
            })
            .then(response => dispatch(new SaveLocationPath(response, id)))
            .then(() => dispatch(new StopLocationPathLoading()));
    };
}
