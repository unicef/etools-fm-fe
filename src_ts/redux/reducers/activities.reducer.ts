import {Reducer} from 'redux';
import {ActivitiesActions, ActivitiesActionTypes} from '../actions/activities.actions';

const INITIAL_STATE: IActivitiesState = {
  listData: null
};

export const activities: Reducer<IActivitiesState, any> = (
  state: IActivitiesState = INITIAL_STATE,
  action: ActivitiesActions
) => {
  switch (action.type) {
    case ActivitiesActionTypes.SET_ACTIVITIES_LIST:
      return {...state, listData: action.payload};
    default:
      return state;
  }
};
