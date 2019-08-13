import { ErrorUpdateUserData, FinishUpdateUserData, StartUpdateUserData, UpdateUserData } from '../actions/user.actions';
import { EtoolsRequest } from '../../endpoints/request';
import { getEndpoint } from '../../endpoints/endpoints';
import { PROFILE_ENDPOINT } from '../../endpoints/endpoints-list';
import { Dispatch } from 'redux';

export function getCurrentUserData(): (dispatch: Dispatch) => Promise<any> {
    return (dispatch: Dispatch) => {
        const endpoint: IEtoolsEndpoint = getEndpoint(PROFILE_ENDPOINT);
        if (!endpoint) {
            console.error(`Can not load user data. Reason: endpoint was not found.`);
            return Promise.resolve();
        }
        return EtoolsRequest.sendRequest({ endpoint }).then((response: IEtoolsUserModel) => {
            // console.log('response', response);
            dispatch(new UpdateUserData(response));
        }).catch((error: GenericObject) => {
            console.error('[EtoolsUser]: getUserData req error...', error);
            return Promise.resolve();
        });
    };
}

export function updateCurrentUserData(profile: GenericObject): (dispatch: Dispatch) => Promise<any> {
    return (dispatch: Dispatch) => {
        const endpoint: IEtoolsEndpoint = getEndpoint(PROFILE_ENDPOINT);
        if (!endpoint) {
            console.error(`Can not load user data. Reason: endpoint was not found.`);
            return Promise.resolve();
        }
        dispatch(new StartUpdateUserData());
        return EtoolsRequest.sendRequest({
            method: 'PATCH',
            endpoint,
            body: profile
        }).then((response: IEtoolsUserModel) => {
            dispatch(new UpdateUserData(response));
        }).catch((error: GenericObject) => {
            dispatch(new ErrorUpdateUserData(error));
        }).then(() => dispatch(new FinishUpdateUserData()));
    };
}
