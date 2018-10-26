import { Dispatch } from 'redux';
import { SetPermissions } from '../actions/permissions.actions';

export function loadPermissions(endpointUrl: string, collectionName: string) {
    return function(dispatch: Dispatch) {
        return fetch(endpointUrl, {method: 'OPTIONS'})
            .then(resp => resp.json())
            .then(permissions => dispatch(new SetPermissions(collectionName, permissions)));
    };
}
