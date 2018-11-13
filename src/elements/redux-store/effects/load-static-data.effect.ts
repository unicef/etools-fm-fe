import { getEndpoint } from '../../app-config/app-config';
import { AddStaticData } from '../actions/static-data.actions';
import { Dispatch } from 'redux';

export function loadStaticData(dataName: string) {
    return (dispatch: Dispatch) => {
        const endpoint = getEndpoint(dataName);
        const url = endpoint && (endpoint as StaticEndpoint).url;
        if (!url) {
            console.error(`Can not load static data "${dataName}". Reason: url was not found.`);
            return Promise.resolve();
        }
        return fetch(url)
            .then(resp => resp.json())
            .then(data => {
                const staticData = data.results || data;
                dispatch(new AddStaticData(dataName, staticData));
            })
            .catch((error) => {
                console.error(`Can not load static data "${dataName}". Reason: request error.`);
                console.error(error);
                return Promise.resolve();
            });
    };
}