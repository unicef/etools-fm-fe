import {FullReportsActionTypes, FullReportsActions} from '../actions/co-overview.actions';
import {Reducer} from 'redux';

const initialState: IFullReportsState = {
  isRequest: {
    load: false
  },
  data: {},
  error: null
};

export const fullReports: Reducer<IFullReportsState, any> = (
  state: IFullReportsState = initialState,
  action: FullReportsActions
) => {
  switch (action.type) {
    case FullReportsActionTypes.FULL_REPORT_DATA_REQUEST:
      return {
        ...state,
        isRequest: {
          load: true
        }
      };

    case FullReportsActionTypes.FULL_REPORT_DATA_SUCCESS:
      return {
        ...state,
        isRequest: {
          load: false
        },
        data: {
          ...state.data,
          [action.payload.id]: action.payload
        }
      };

    case FullReportsActionTypes.FULL_REPORT_DATA_FAILURE:
      return {
        ...state,
        isRequest: {...state.isRequest, load: false},
        error: action.payload
      };

    default: {
      return state;
    }
  }
};
