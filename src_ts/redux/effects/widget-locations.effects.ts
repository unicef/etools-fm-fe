import {
  SaveLocationPath,
  SetLocationPathLoading,
  AddWidgetLocations,
  SetWidgetLocationsLoading,
  SetWidgetLocations
} from '../actions/widget-locations.actions';
import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {WIDGET_LOCATION_PATH, WIDGET_LOCATIONS_CHUNK} from '../../endpoints/endpoints-list';

export function loadLocationsChunk(
  params: GenericObject = {}
): (dispatch: Dispatch, getState: () => IRootState) => Promise<void> {
  return (dispatch: Dispatch, getState: () => IRootState) => {
    const state: IRootState = getState();
    const {reload} = params;
    const {page, query, search} = {...state.widgetLocations, ...params};
    const endpoint: IResultEndpoint = getEndpoint(WIDGET_LOCATIONS_CHUNK);
    let url = `${endpoint.url}?page=${page}`;
    if (query) {
      url = `${url}&${query}`;
    }
    if (search) {
      url = `${url}&search=${search}`;
    }
    dispatch(new SetWidgetLocationsLoading(true));

    return request<IListData<WidgetLocation>>(url, {method: 'GET'})
      .then((response: IListData<WidgetLocation>) => {
        if (reload) {
          dispatch(new SetWidgetLocations(response, page, search, query));
        } else {
          dispatch(new AddWidgetLocations(response, page, search, query));
        }
      })
      .then(() => {
        dispatch(new SetWidgetLocationsLoading(false));
      });
  };
}

export function loadLocationPath(id: string): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(WIDGET_LOCATION_PATH, {id});
    dispatch(new SetLocationPathLoading(true));

    return (
      request<WidgetLocation[]>(endpoint.url, {method: 'GET'})
        // .catch(() => {
        //     dispatch(new AddNotification('Can not Load Location path'));
        //     return [];
        // })
        .then((response: WidgetLocation[]) => dispatch(new SaveLocationPath(response, id)))
        .then(() => {
          dispatch(new SetLocationPathLoading(false));
        })
    );
  };
}
