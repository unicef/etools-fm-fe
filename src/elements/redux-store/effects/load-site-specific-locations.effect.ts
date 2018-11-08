import { SetSpecificLocatinos } from '../actions/site-specific-locations.actions';
import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';

export function loadSiteLocations() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('siteLocations') as StaticEndpoint;
        return fetch(endpoint.url, {method: 'GET'})
            .then(resp => resp.json())
            .then(response => dispatch(new SetSpecificLocatinos({...response, current: endpoint.url})));
    };
}
