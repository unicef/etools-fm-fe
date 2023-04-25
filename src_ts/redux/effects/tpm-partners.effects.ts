import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {SetTPMPartnersList, SetTPMPartnersPermissions} from '../actions/tpm-partners.actions';
import {ACTIVATE_VENDOR, TPM_PARTNERS, SYNC_VENDOR_DATA} from '../../endpoints/endpoints-list';
import {EtoolsRouteQueryParams} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';

export function loadPartnersList(
  params: EtoolsRouteQueryParams,
  getOptions: boolean
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(TPM_PARTNERS);
    const resultUrl = `${url}&${EtoolsRouter.encodeQueryParams(params)}`;
    const requestsUrl: any[] = [request<IListData<IActivityTpmPartner>>(resultUrl, {method: 'GET'})];
    if (getOptions) {
      requestsUrl.push(request<GenericObject>(url, {method: 'OPTIONS'}));
    }
    return Promise.all(requestsUrl).then((response: any[]) => {
      dispatch(new SetTPMPartnersList(response[0]));
      if (getOptions) {
        dispatch(new SetTPMPartnersPermissions(response[1]));
      }
    });
  };
}

export function getVendorByNumber(id: string): Promise<IActivityTpmPartnerExtended> {
  const {url}: IResultEndpoint = getEndpoint(SYNC_VENDOR_DATA, {id});
  const resultUrl = `${url}`;
  return request<IActivityTpmPartnerExtended>(resultUrl, {method: 'GET'});
}

export function activateVendor(id: string): Promise<void> {
  const {url}: IResultEndpoint = getEndpoint(ACTIVATE_VENDOR, {id});
  const resultUrl = `${url}`;
  return request<void>(resultUrl, {method: 'POST'});
}
