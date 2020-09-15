import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {ACTION_POINTS_DETAILS, ACTION_POINTS_LIST} from '../../endpoints/endpoints-list';
import {
  SetActionPointsList,
  SetActionPointsUpdateStatus,
  UpdateActionPointError
} from '../actions/action-points.actions';

export function loadActionPoints(activityId: number): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_LIST, {activityId});
    return request<IListData<ActionPoint>>(url, {method: 'GET'}).then((response: IListData<ActionPoint>) => {
      dispatch(new SetActionPointsList(response.results));
    });
  };
}

export function updateActionPoint(
  activityId: number,
  data: Partial<EditableActionPoint>
): (dispatch: Dispatch) => Promise<void | UpdateActionPointError> {
  return (dispatch: Dispatch) => {
    let id = '';
    let method = 'POST';
    if (data.id) {
      id = `${data.id}/`;
      method = 'PATCH';
    }
    const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_DETAILS, {activityId, id});
    dispatch(new SetActionPointsUpdateStatus(true));
    return request<ActionPoint>(url, {method: method, body: JSON.stringify(data)})
      .then(() => {
        dispatch<AsyncEffect>(loadActionPoints(activityId));
      })
      .catch((error: GenericObject) => {
        dispatch(new UpdateActionPointError(error));
      })
      .finally(() => dispatch(new SetActionPointsUpdateStatus(false)));
  };
}
