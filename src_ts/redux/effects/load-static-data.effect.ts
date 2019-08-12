import { Dispatch } from 'redux';
import { AddStaticData, ResetStaticData } from '../actions/static-data.actions';
import { EtoolsRequest } from '../../endpoints/request';
import { getEndpoint } from '../../endpoints/endpoints';

export function loadStaticData(dataName: keyof IStaticDataState, params?: any, reset?: boolean): (dispatch: Dispatch) => Promise<any> {
    return (dispatch: Dispatch) => {
        const endpoint: IEtoolsEndpoint = getEndpoint(dataName, params);
        if (!endpoint) {
            console.error(`Can not load static data "${dataName}". Reason: endpoint was not found.`);
            return Promise.resolve();
        }
        return EtoolsRequest.sendRequest({ endpoint })
            .then((data: any) => {
                const staticData: any = data.results || data;
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
