import {
    SaveLocationPath,
    SaveWidgetLocations,
    SetLocationPathLoading,
    SetWidgetLocationsLoading
} from '../actions/widget-locations.actions';
import { Dispatch } from 'redux';
import { getEndpoint } from '../../endpoints/endpoints';
import { request } from '../../endpoints/request';
import { WIDGET_LOCATION_PATH, WIDGET_LOCATIONS } from '../../endpoints/endpoints-list';

export function loadWidgetLocations(queryParams: string): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const endpoint: IResultEndpoint = getEndpoint(WIDGET_LOCATIONS);
        const url: string = `${ endpoint.url }${ queryParams }`;
        dispatch(new SetWidgetLocationsLoading(true));

        return request<WidgetLocation[]>(url, { method: 'GET' })
            .then((response: WidgetLocation[]) => dispatch(new SaveWidgetLocations(response, queryParams)))
            .then(() => { dispatch(new SetWidgetLocationsLoading(false)); });
    };
}

export function loadLocationPath(id: string): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const endpoint: IResultEndpoint = getEndpoint(WIDGET_LOCATION_PATH, { id });
        dispatch(new SetLocationPathLoading(true));

        return request<WidgetLocation[]>(endpoint.url, { method: 'GET' })
            // .catch(() => {
            //     dispatch(new AddNotification('Can not Load Location path'));
            //     return [];
            // })
            .then((response: WidgetLocation[]) => dispatch(new SaveLocationPath(response, id)))
            .then(() => { dispatch(new SetLocationPathLoading(false)); });
    };
}
