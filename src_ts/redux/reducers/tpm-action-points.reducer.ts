import {Reducer} from 'redux';
import {ActionPointsActions, ActionPointsActionTypes} from '../actions/action-points.actions';

const INITIAL_STATE: ITPMActionPointsListState = {
  data: [],
  updateInProcess: false,
  error: {}
};

export const tpmActionPointsList: Reducer<ITPMActionPointsListState, any> = (
  state: ITPMActionPointsListState = INITIAL_STATE,
  action: ActionPointsActions
) => {
  switch (action.type) {
    case ActionPointsActionTypes.SET_TPM_ACTION_POINTS_LIST:
      return {...state, data: action.payload};
    case ActionPointsActionTypes.UPDATE_ACTION_POINT_ERROR:
      return {...state, error: action.payload};
    case ActionPointsActionTypes.SET_TPM_ACTION_POINTS_UPDATE_STATUS:
      return {...state, updateInProcess: action.payload};
    default:
      return state;
  }
};
