import {FindingsActions, FindingsActionTypes} from '../actions/findings-components.actions';
import {Reducer} from 'redux';

const INITIAL: IFindingsComponentsState = {
  editedFindingsComponent: null,
  overallAndFindingsUpdate: null
};

export const findingsComponents: Reducer<IFindingsComponentsState, any> = (
  state: IFindingsComponentsState = INITIAL,
  action: FindingsActions
) => {
  switch (action.type) {
    case FindingsActionTypes.SET_EDITED_FINDINGS_COMPONENT:
      return {...state, editedFindingsComponent: action.payload};
    case FindingsActionTypes.SET_FINDINGS_UPDATE_STATE:
      return {...state, overallAndFindingsUpdate: action.payload};
    default:
      return state;
  }
};
