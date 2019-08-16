import { SetSpecificLocatinos } from '../actions/site-specific-locations.actions';
import { Dispatch } from 'redux';
import {
    SetSiteLocationsUpdatingError,
    StartSiteLocationsUpdating,
    StopSiteLocationsUpdating
} from '../actions/site-specific-locations.actions';
import { request } from '../../endpoints/request';
import { getEndpoint } from '../../endpoints/endpoints';
import { SITE_DETAILS, SITES_LIST } from '../../endpoints/endpoints-list';

export function loadSiteLocations(): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const { url }: IResultEndpoint = getEndpoint(SITES_LIST);
        return request<Site[]>(url as string, { method: 'GET' })
            .catch(() => {
                // dispatch(new AddNotification('Can not Load locations'));
                return [] as Site[];
            })
            .then((response: Site[]) => {
                const respObject: IStatedListData<Site> = {
                    count: response.length,
                    next: null,
                    previous: null,
                    results: response,
                    current: url
                };
                dispatch(new SetSpecificLocatinos(respObject));
            });
    };
}

export function updateSiteLocation(id: number, siteLocation: Site): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const endpoint: IResultEndpoint = getEndpoint(SITE_DETAILS, { id });
        return startRequest(dispatch, endpoint.url, 'PATCH', siteLocation);
    };
}

export function removeSiteLocation(id: string | number): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const endpoint: IResultEndpoint = getEndpoint(SITE_DETAILS, { id });
        return startRequest(dispatch, endpoint.url, 'DELETE', {});
    };
}

export function addSiteLocation(siteLocation: Site): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const endpoint: IResultEndpoint = getEndpoint(SITES_LIST);
        return startRequest(dispatch, endpoint.url, 'POST', siteLocation);
    };
}

function startRequest(dispatch: Dispatch, url: string, method: RequestMethod, data: Site | {}): Promise<void> {
    dispatch(new StartSiteLocationsUpdating());
    // dispatch(new ResetNotification());

    const options: RequestInit = { method, body: JSON.stringify(data) };
    return request(url, options)
        .then(() => dispatch(new SetSiteLocationsUpdatingError({ errors: null })))
        .catch((error: any) => dispatch(new SetSiteLocationsUpdatingError({ errors: error.data } )))
        .then(() => { dispatch(new StopSiteLocationsUpdating()); });
}
