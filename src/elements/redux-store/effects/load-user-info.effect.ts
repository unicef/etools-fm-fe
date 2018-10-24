import { AddUserData } from '../actions/user-data.actions';
import { getEndpoint } from '../../app-config/app-config';
import { Dispatch } from 'redux';

export function loadUserData() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('userProfile') as StaticEndpoint;
        return fetch(endpoint.url)
            .then(resp => resp.json())
            .then(user => dispatch(new AddUserData(user)));
    };
}
