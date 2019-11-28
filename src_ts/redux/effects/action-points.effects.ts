import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {
  ACTION_POINTS_CATEGORIES,
  ACTION_POINTS_DETAILS,
  ACTION_POINTS_LIST,
  ACTION_POINTS_OFFICES
} from '../../endpoints/endpoints-list';
import {
  GetActionPointsCategories,
  GetActionPointsOffices,
  SetActionPointsList,
  SetActionPointsUpdateState,
  UpdateActionPointError
} from '../actions/action-points.actions';

export function loadActionPoints(activityId: number): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_LIST, {activityId});
    return request<Pageable<ActionPoint>>(url, {method: 'GET'}).then((response: Pageable<ActionPoint>) => {
      dispatch(new SetActionPointsList(response.results));
    });
  };
}

export function loadActionPointsCategories(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_CATEGORIES);
    return request<ActionPointsCategory[]>(url, {method: 'GET'}).then((response: ActionPointsCategory[]) => {
      dispatch(new GetActionPointsCategories(response));
    });
  };
}

export function loadActionPointsOffices(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_OFFICES);
    return request<OfficeSectionType[]>(url, {method: 'GET'}).then((response: OfficeSectionType[]) => {
      dispatch(new GetActionPointsOffices(response));
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
    const id: string = `${actionPointId}/`;
    const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_DETAILS, {activityId, id});
    return request<ActionPoint>(url, {method: 'PATCH', body: JSON.stringify(data)})
      .then(() => {
        dispatch<AsyncEffect>(loadActionPoints(activityId));
        dispatch(new SetActionPointsUpdateState(true));
      })
      .catch((error: GenericObject) => {
        dispatch(new UpdateActionPointError(error));
        dispatch(new SetActionPointsUpdateState(false));
      });
  };
}

export function createActionPoint(
  activityId: number,
  data: Partial<EditableActionPoint>
): (dispatch: Dispatch) => Promise<void | UpdateActionPointError> {
  return (dispatch: Dispatch) => {
    dispatch(new SetActionPointsUpdateState(false));
    const id: string = '';
    const {url}: IResultEndpoint = getEndpoint(ACTION_POINTS_DETAILS, {activityId, id});
    return request<ActionPoint>(url, {method: 'POST', body: JSON.stringify(data)})
      .then(() => {
        dispatch<AsyncEffect>(loadActionPoints(activityId));
        dispatch(new SetActionPointsUpdateState(true));
      })
      .catch((error: GenericObject) => {
        dispatch(new UpdateActionPointError(error));
        dispatch(new SetActionPointsUpdateState(false));
      });
  };
}
