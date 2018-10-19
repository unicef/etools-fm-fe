import { AddUserData } from '../actions/user-data.actions';
import { getEndpoint } from '../../app-config/app-config';

export function loadUserData() {
    return function(dispatch) {
        const endpoint = getEndpoint('userProfile');
        return fetch(endpoint.url)
            .then(resp => resp.json())
            .then(user => dispatch(new AddUserData(user)));
    };
}
