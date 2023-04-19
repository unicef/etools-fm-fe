import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {request} from '../../endpoints/request';
import {SetActivitiesList} from '../actions/activities.actions';
import {ACTIVITIES_LIST} from '../../endpoints/endpoints-list';
import {EtoolsRouteQueryParams} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

export function loadActivitiesList(params: EtoolsRouteQueryParams): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTIVITIES_LIST);
    const resultUrl = `${url}?${EtoolsRouter.encodeQueryParams(params)}`;
    return request<IListData<IListActivity>>(resultUrl, {method: 'GET'}).then((response: IListData<IListActivity>) => {
      dispatch(new SetActivitiesList(response));
    });
  };
}
