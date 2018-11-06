import { SetMethodTypesList } from '../actions/settings-method-types.actions';
import { Dispatch } from 'redux';
import { getEndpoint, objectToQuery } from '../../app-config/app-config';

export function loadMethodTypes(queryParams: QueryParams) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('methodTypes') as StaticEndpoint;
        const url = endpoint.url + objectToQuery(queryParams);
        return fetch(url, {method: 'GET'})
            .then(resp => resp.json())
            .then(response => dispatch(new SetMethodTypesList({...response, current: url})));
    };
}
