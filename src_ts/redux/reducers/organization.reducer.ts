import {AnyAction, Reducer} from 'redux';
import {OrganizationActionTypes} from '../actions/organization.actions';

const INIT_ORGANIZATION_STATE: IRequestState = {
  isRequest: {
    load: false
  },
  error: {}
};

export const organization: Reducer<IRequestState, any> = (
  state: IRequestState = INIT_ORGANIZATION_STATE,
  action: AnyAction
) => {
  switch (action.type) {
    case OrganizationActionTypes.CHANGE_ORGANIZATION_REQUEST:
      return {
        ...state,
        isRequest: {...state.isRequest, load: true},
        error: null
      };
    case OrganizationActionTypes.CHANGE_ORGANIZATION_SUCCESS:
      return {
        ...state,
        isRequest: {...state.isRequest, load: false},
        error: null
      };
    case OrganizationActionTypes.CHANGE_ORGANIZATION_FAILURE:
      return {
        ...state,
        isRequest: {...state.isRequest, load: false},
        error: action.payload
      };
    default:
      return state;
  }
};
