import {AnyAction, Reducer} from 'redux';
import {GlobalLoadingActionTypes} from '../actions/global-loading.actions';

const INITIAL: IGlobalLoadingState = {
  message: null
};

export const globalLoading: Reducer<IGlobalLoadingState, any> = (
  state: IGlobalLoadingState = INITIAL,
  action: AnyAction
) => {
  switch (action.type) {
    case GlobalLoadingActionTypes.GLOBAL_LOADING_STATE_RETRIEVE:
      return state;
    case GlobalLoadingActionTypes.GLOBAL_LOADING_STATE_UPDATE:
      return {
        ...state,
        message: action.payload
      };
    default:
      return state;
  }
};
