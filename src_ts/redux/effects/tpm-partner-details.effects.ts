import {IAsyncAction} from '../middleware';
import {getEndpoint} from '../../endpoints/endpoints';
import {TPM_DETAILS} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {TPMPartnerDetailsActions} from '../actions/tpm-partners-details.actions';

export function requestTPMPartnerDetails(id: string): IAsyncAction {
  return {
    types: [
      TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_GET_REQUEST,
      TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_GET_SUCCESS,
      TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_GET_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(TPM_DETAILS, {id});
      const resultUrl = `${url}`;
      return Promise.all([request(resultUrl), request(resultUrl, {method: 'OPTIONS'})]);
    }
  };
}

export function updateTPMPartnerDetails(id: number, partnerDetails: Partial<IActivityDetails>): IAsyncAction {
  return {
    types: [
      TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_UPDATE_REQUEST,
      TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_UPDATE_SUCCESS,
      TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_UPDATE_FAILURE
    ],
    api: () => {
      const {url}: IResultEndpoint = getEndpoint(TPM_DETAILS, {id});
      const options: RequestInit = {
        method: 'PATCH',
        body: JSON.stringify(partnerDetails)
      };
      return request(url, options);
    }
  };
}
