import {AnyAction, Reducer} from 'redux';
import {ActivityDetailsActions} from '../actions/activity-details.actions';

const INITIAL: IActivityDetailsState = {
  isRequest: {
    create: false,
    load: false,
    update: false,
    statusChange: false
  },
  editedCard: null,
  error: null,
  data: null
};

export const activityDetails: Reducer<IActivityDetailsState, any> = (
  state: IActivityDetailsState = INITIAL,
  action: AnyAction
) => {
  switch (action.type) {
    case ActivityDetailsActions.SET_EDITED_DETAILS_CARD:
      return {
        ...state,
        editedCard: action.payload
      };

    // DETAILS GET ACTIONS
    case ActivityDetailsActions.ACTIVITY_DETAILS_GET_REQUEST: {
      return {
        ...state,
        isRequest: {...state.isRequest, load: true},
        error: null
      };
    }
    case ActivityDetailsActions.ACTIVITY_DETAILS_GET_SUCCESS: {
      return {
        ...state,
        isRequest: {...state.isRequest, load: false},
        data: action.payload,
        error: null
      };
    }
    case ActivityDetailsActions.ACTIVITY_DETAILS_GET_FAILURE: {
      return {
        ...state,
        isRequest: {...state.isRequest, load: false},
        error: action.payload
      };
    }

    // DETAILS CREATE ACTIONS
    case ActivityDetailsActions.ACTIVITY_DETAILS_CREATE_REQUEST:
      return {
        ...state,
        isRequest: {...state.isRequest, create: true},
        error: null
      };
    case ActivityDetailsActions.ACTIVITY_DETAILS_CREATE_SUCCESS:
      return {
        ...state,
        isRequest: {...state.isRequest, create: false},
        data: action.payload,
        error: null
      };
    case ActivityDetailsActions.ACTIVITY_DETAILS_CREATE_FAILURE:
      return {
        ...state,
        isRequest: {...state.isRequest, create: false},
        error: action.payload
      };

    // DETAILS UPDATE ACTIONS
    case ActivityDetailsActions.ACTIVITY_DETAILS_UPDATE_REQUEST:
      return {
        ...state,
        isRequest: {...state.isRequest, update: true},
        error: null
      };
    case ActivityDetailsActions.ACTIVITY_DETAILS_UPDATE_SUCCESS:
      return {
        ...state,
        isRequest: {...state.isRequest, update: false},
        data: action.payload,
        error: null
      };
    case ActivityDetailsActions.ACTIVITY_DETAILS_UPDATE_FAILURE:
      return {
        ...state,
        isRequest: {...state.isRequest, update: false},
        error: action.payload
      };

    // STATUS CHANGE ACTIONS
    case ActivityDetailsActions.ACTIVITY_STATUS_CHANGE_REQUEST:
      return {
        ...state,
        isRequest: {...state.isRequest, statusChange: true},
        error: null
      };
    case ActivityDetailsActions.ACTIVITY_STATUS_CHANGE_SUCCESS:
      return {
        ...state,
        isRequest: {...state.isRequest, statusChange: false},
        data: action.payload,
        error: null
      };
    case ActivityDetailsActions.ACTIVITY_STATUS_CHANGE_FAILURE:
      return {
        ...state,
        isRequest: {...state.isRequest, statusChange: false},
        error: action.payload
      };
    default:
      return state;
  }
};
