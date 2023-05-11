import {OrganizationActionTypes} from '../actions/organization.actions';
import {getEndpoint} from '../../endpoints/endpoints';
import {CHANGE_ORGANIZATION} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {IAsyncAction} from '../middleware';

export function changeCurrentUserOrganization(organizationId: number): IAsyncAction {
  return {
    types: [
      OrganizationActionTypes.CHANGE_ORGANIZATION_REQUEST,
      OrganizationActionTypes.CHANGE_ORGANIZATION_SUCCESS,
      OrganizationActionTypes.CHANGE_ORGANIZATION_FAILURE
    ],
    api: () => {
      const endpoint: IEtoolsEndpoint = getEndpoint(CHANGE_ORGANIZATION);
      if (!endpoint || !endpoint.url) {
        return Promise.reject();
      }
      return request(endpoint.url, {
        method: 'POST',
        body: JSON.stringify({
          organization: organizationId
        })
      });
    }
  };
}
