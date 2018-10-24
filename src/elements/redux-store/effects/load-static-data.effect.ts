import { getEndpoint } from '../../app-config/app-config';
import { AddStaticData } from '../actions/static-data.actions';

export function loadStaticData(dataName) {
    return (dispatch) => {
        const endpoint = getEndpoint(dataName);
        const url = endpoint && endpoint.url;
        if (!url) {
            console.error(`Can not load static data "${dataName}". Reason: url was not found.`);
            return Promise.resolve();
        }
        return fetch(url)
            .then(resp => resp.json())
            .then(data => dispatch(new AddStaticData(dataName, data)))
            .catch((error) => {
                console.error(`Can not load static data "${dataName}". Reason: request error.`);
                console.error(error);
                return Promise.resolve();
            });
    };
}
