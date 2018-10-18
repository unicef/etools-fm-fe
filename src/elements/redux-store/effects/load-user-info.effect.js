import { AddUserData } from '../actions/user-data.actions';
import { endpoints } from '../../app-config/endpoints';

export function loadUserData() {
    return function(dispatch) {
        return fetch(endpoints.userProfile.url)
            .then(resp => resp.json())
            .then(user => dispatch(new AddUserData(user)));
    };
}
