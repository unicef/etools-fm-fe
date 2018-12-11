import { getEndpoint } from '../../app-config/app-config';
import { AddStaticData, ResetStaticData } from '../actions/static-data.actions';
import { Dispatch } from 'redux';
import { EtoolsRequest } from '../request';

export function loadStaticData(dataName: string, params?: any, reset?: boolean) {
    return (dispatch: Dispatch) => {
        const endpoint = getEndpoint(dataName, params);
        if (!endpoint) {
            console.error(`Can not load static data "${dataName}". Reason: endpoint was not found.`);
            return Promise.resolve();
        }
        return EtoolsRequest.sendRequest({endpoint})
            // .then(resp => resp.json())
            .then((data: any) => {
                const staticData = data.results || data;
                if (reset) {
                    dispatch(new ResetStaticData(dataName, staticData));
                } else {
                    dispatch(new AddStaticData(dataName, staticData));
                }
            })
            .catch((error: any) => {
                console.error(`Can not load static data "${dataName}". Reason: request error.`);
                console.error(error);
                return Promise.resolve();
            });
    };
}
