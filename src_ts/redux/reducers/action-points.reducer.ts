import {Reducer} from 'redux';
import {ActionPointsActions, ActionPointsActionTypes} from '../actions/action-points.actions';

const INITIAL_STATE: IActionPointsListState = {
  data: [],
  updateInProcess: false,
  error: {}
};

export const actionPointsList: Reducer<IActionPointsListState, any> = (
  state: IActionPointsListState = INITIAL_STATE,
  action: ActionPointsActions
) => {
  switch (action.type) {
    case ActionPointsActionTypes.SET_ACTION_POINTS_LIST:
      return {...state, data: action.payload};
    case ActionPointsActionTypes.UPDATE_ACTION_POINT_ERROR:
      return {...state, error: action.payload};
    case ActionPointsActionTypes.SET_ACTION_POINTS_UPDATE_STATUS:
      return {...state, updateInProcess: action.payload};
    default:
      return state;
  }
};
