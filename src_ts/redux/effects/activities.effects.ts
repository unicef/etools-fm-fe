import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {EtoolsRouter} from '../../routing/routes';
import {request} from '../../endpoints/request';
import {SetActivitiesList} from '../actions/activities.actions';
import {ACTIVITIES_LIST} from '../../endpoints/endpoints-list';

export function loadActivitiesList(params: IRouteQueryParams): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTIVITIES_LIST);
    const resultUrl: string = `${url}?${EtoolsRouter.encodeParams(params)}`;
    return request<IListData<IListActivity>>(resultUrl, {method: 'GET'}).then((response: IListData<IListActivity>) => {
      dispatch(new SetActivitiesList(response));
    });
  };
}
