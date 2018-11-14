import { request } from '../request';
import { SetSpecificLocatinos } from '../actions/site-specific-locations.actions';
import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import {
    SetSiteLocationsUpdatingError,
    StartSiteLocationsUpdating,
    StopSiteLocationsUpdating
} from '../actions/site-specific-locations.actions';
import { AddNotification, ResetNotification } from '../actions/notification.actions';

export function loadSiteLocations() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('siteLocations') as StaticEndpoint;
        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification('Can not Load locations'));
                return {results: []};
            })
            .then((response = []) => {
                const respObject = {
                    count: response.length,
                    next: null,
                    previous: null,
                    results: response,
                    current: endpoint.url
                };
                dispatch(new SetSpecificLocatinos(respObject));
            });
    };
}

export function updateSiteLocation(id: number, siteLocation: Site) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('siteLocationsDetails', {id});
        return startRequest(dispatch, endpoint.url, 'PATCH', siteLocation);
    };
}

export function removeSiteLocation(id: string | number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('siteLocationsDetails', {id});
        return startRequest(dispatch, endpoint.url, 'DELETE', {});
    };
}

export function addSiteLocation(siteLocation: Site) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('siteLocations');
        return startRequest(dispatch, endpoint.url, 'POST', siteLocation);
    };
}

function startRequest(dispatch: Dispatch, url: string, method: RequestMethod, data: Site | {}) {
    dispatch(new StartSiteLocationsUpdating());
    dispatch(new ResetNotification());

    const options = {method,  body: JSON.stringify(data)};
    return request(url, options)
        .then(() => dispatch(new SetSiteLocationsUpdatingError({errors: null})))
        .catch((error) => dispatch(new SetSiteLocationsUpdatingError({errors: error.data})))
        .then(() => dispatch(new StopSiteLocationsUpdating()));
}