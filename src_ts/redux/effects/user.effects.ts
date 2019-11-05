import {EtoolsRequest} from '../../endpoints/request';
import {getEndpoint} from '../../endpoints/endpoints';
import {PROFILE_ENDPOINT} from '../../endpoints/endpoints-list';
import {UserActionTypes} from '../actions/user.actions';
import {IAsyncAction} from '../middleware';

export function getCurrentUserData(): IAsyncAction {
  return {
    types: [UserActionTypes.USER_DATA_REQUEST, UserActionTypes.USER_DATA_SUCCESS, UserActionTypes.USER_DATA_FAILURE],
    api: () => {
      const endpoint: IEtoolsEndpoint = getEndpoint(PROFILE_ENDPOINT);
      if (!endpoint) {
        console.error(`Can not load user data. Reason: endpoint was not found.`);
        return Promise.resolve();
      }
      return EtoolsRequest.sendRequest({endpoint});
    }
  };
}

export function updateCurrentUserData(profile: GenericObject): IAsyncAction {
  return {
    types: [UserActionTypes.USER_DATA_REQUEST, UserActionTypes.USER_DATA_SUCCESS, UserActionTypes.USER_DATA_FAILURE],
    api: () => {
      const endpoint: IEtoolsEndpoint = getEndpoint(PROFILE_ENDPOINT);
      if (!endpoint) {
        console.error(`Can not load user data. Reason: endpoint was not found.`);
        return Promise.resolve();
      }
      return EtoolsRequest.sendRequest({
        method: 'PATCH',
        endpoint,
        body: profile
      });
    }
  };
}
