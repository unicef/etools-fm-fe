import { AddUserData } from '../actions/user-data.actions';
import { getEndpoint } from '../../app-config/app-config';
import { Dispatch } from 'redux';
import { request } from '../request';

export function loadUserData() {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('userProfile') as StaticEndpoint;
        return request(endpoint.url)
            .then(user => dispatch(new AddUserData(user)))
            .catch((error) => {
                if (error.status === 403) {
                    window.location.href = window.location.origin + '/';
                }
            });
    };
}
