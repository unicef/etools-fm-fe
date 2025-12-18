import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {request} from '../../endpoints/request';
import {SetActivitiesList} from '../actions/activities.actions';
import {ACTIVITIES_LIST} from '../../endpoints/endpoints-list';
import {EtoolsRouteQueryParams} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {store} from '../store.ts';
import {SetActionPointsParams} from '../actions/action-points.actions.ts';

export function loadActivitiesList(params: EtoolsRouteQueryParams): (dispatch: Dispatch) => Promise<void> {
  store.dispatch(new SetActionPointsParams({page_size: 10, page: 1}));
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTIVITIES_LIST);
    const resultUrl = `${url}?${EtoolsRouter.encodeQueryParams(params)}`;
    return request<IListData<IListActivity>>(resultUrl, {method: 'GET'}).then((response: IListData<IListActivity>) => {
      dispatch(new SetActivitiesList(response));
    });
  };
}
