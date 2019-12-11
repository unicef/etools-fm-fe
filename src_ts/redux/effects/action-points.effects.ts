import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {ACTION_POINTS_DETAILS, ACTION_POINTS_LIST} from '../../endpoints/endpoints-list';
import {
  SetActionPointsList,
  SetActionPointsUpdateState,
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
  actionPointId: number,
  data: Partial<EditableActionPoint>
): (dispatch: Dispatch) => Promise<void | UpdateActionPointError> {
  return (dispatch: Dispatch) => {
    dispatch(new SetActionPointsUpdateState(false));
    dispatch(new SetActionPointsUpdateStatus(true));
    const id: string = `${actionPointId}/`;
    const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_DETAILS, {activityId, id});
    return request<ActionPoint>(url, {method: 'PATCH', body: JSON.stringify(data)})
      .then(() => {
        dispatch<AsyncEffect>(loadActionPoints(activityId));
        dispatch(new SetActionPointsUpdateState(true));
        dispatch(new SetActionPointsUpdateStatus(false));
      })
      .catch((error: GenericObject) => {
        dispatch(new UpdateActionPointError(error));
        dispatch(new SetActionPointsUpdateState(false));
        dispatch(new SetActionPointsUpdateStatus(false));
      });
  };
}

export function createActionPoint(
  activityId: number,
  data: Partial<EditableActionPoint>
): (dispatch: Dispatch) => Promise<void | UpdateActionPointError> {
  return (dispatch: Dispatch) => {
    dispatch(new SetActionPointsUpdateState(false));
    dispatch(new SetActionPointsUpdateStatus(true));
    const id: string = '';
    const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_DETAILS, {activityId, id});
    return request<ActionPoint>(url, {method: 'POST', body: JSON.stringify(data)})
      .then(() => {
        dispatch<AsyncEffect>(loadActionPoints(activityId));
        dispatch(new SetActionPointsUpdateState(true));
        dispatch(new SetActionPointsUpdateStatus(false));
      })
      .catch((error: GenericObject) => {
        dispatch(new UpdateActionPointError(error));
        dispatch(new SetActionPointsUpdateState(false));
        dispatch(new SetActionPointsUpdateStatus(false));
      });
  };
}
