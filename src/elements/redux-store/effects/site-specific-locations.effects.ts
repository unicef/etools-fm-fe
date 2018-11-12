import { SetSpecificLocatinos } from '../actions/site-specific-locations.actions';
import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import {
    SetSiteLocationsUpdatingError,
    StartSiteLocationsUpdating,
    StopSiteLocationsUpdating
} from '../actions/site-specific-locations.actions';

export function loadSiteLocations() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('siteLocations') as StaticEndpoint;
        return fetch(endpoint.url, {method: 'GET'})
            .then(resp => resp.json())
            .then(response => dispatch(new SetSpecificLocatinos({...response, current: endpoint.url})));
    };
}

export function updateSiteLocation(siteLocation: Site) {
    return function(dispatch: Dispatch) {
        const id = siteLocation.id;
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

    const options = {method,  body: JSON.stringify(data), headers: {'Content-Type': 'application/json'}};
    return fetch(url, options)
        .then(() => dispatch(new SetSiteLocationsUpdatingError({errors: null})))
        .catch((error) => dispatch(new SetSiteLocationsUpdatingError({errors: error.json()})))
        .then(() => dispatch(new StopSiteLocationsUpdating()));
}