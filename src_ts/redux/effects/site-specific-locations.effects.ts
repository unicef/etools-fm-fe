import {
  SetSiteLocationsUpdatingError,
  StartSiteLocationsUpdating,
  StopSiteLocationsUpdating
} from '../actions/site-specific-locations.actions';
import {Dispatch} from 'redux';
import {request} from '../../endpoints/request';
import {getEndpoint} from '../../endpoints/endpoints';
import {SITE_DETAILS, SITES_LIST, LOCATIONS_WITH_SITES} from '../../endpoints/endpoints-list';
import {EtoolsRouteQueryParams} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';

export function loadSites(params: EtoolsRouteQueryParams): Promise<IListData<Site>> {
  const {url}: IResultEndpoint = getEndpoint(SITES_LIST);
  const resultUrl = `${url}?${EtoolsRouter.encodeQueryParams(params)}`;
  return request<IListData<Site>>(resultUrl, {method: 'GET'});
}

export function loadLocationWithSites(params: EtoolsRouteQueryParams): Promise<IListData<LocationType>> {
  const {url}: IResultEndpoint = getEndpoint(LOCATIONS_WITH_SITES);
  const resultUrl = `${url}?${EtoolsRouter.encodeQueryParams(params)}`;
  return request<IListData<LocationType>>(resultUrl, {method: 'GET'});
}

export function updateSiteLocation(id: number, siteLocation: EditedSite): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(SITE_DETAILS, {id});
    return startRequest(dispatch, endpoint.url, 'PATCH', siteLocation);
  };
}

export function removeSiteLocation(id: string | number): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(SITE_DETAILS, {id});
    return startRequest(dispatch, endpoint.url, 'DELETE', {});
  };
}

export function addSiteLocation(siteLocation: Site): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(SITES_LIST);
    return startRequest(dispatch, endpoint.url, 'POST', siteLocation);
  };
}

function startRequest(dispatch: Dispatch, url: string, method: RequestMethod, data: Partial<Site>): Promise<void> {
  dispatch(new StartSiteLocationsUpdating());
  // dispatch(new ResetNotification());

  const options: RequestInit = {method, body: JSON.stringify(data)};
  return request(url, options)
    .then(() => dispatch(new SetSiteLocationsUpdatingError({errors: null})))
    .catch((error: any) => dispatch(new SetSiteLocationsUpdatingError({errors: error.data})))
    .then(() => {
      dispatch(new StopSiteLocationsUpdating());
    });
}
