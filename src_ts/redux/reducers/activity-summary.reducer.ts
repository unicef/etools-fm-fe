import {Reducer} from 'redux';
import {ActivitySummaryActions, ActivitySummaryActionTypes} from '../actions/activity-summary-actions';

const INITIAL: IActivitySummaryState = {
  findingsAndOverall: {
    findings: null,
    overall: undefined
  },
  error: null,
  editedFindingsTab: null,
  updateInProcess: null,
  loading: null
};

export const activitySummary: Reducer<IActivitySummaryState, any> = (
  state: IActivitySummaryState = INITIAL,
  action: ActivitySummaryActions
) => {
  switch (action.type) {
    case ActivitySummaryActionTypes.FINDINGS_AND_OVERALL_GET_REQUEST:
      return {...state, loading: true, error: null};
    case ActivitySummaryActionTypes.FINDINGS_AND_OVERALL_GET_SUCCESS:
      return {...state, loading: false, findingsAndOverall: {...state.findingsAndOverall, ...action.payload}};
    case ActivitySummaryActionTypes.FINDINGS_AND_OVERALL_GET_FAILURE:
      return {...state, loading: false, error: action.payload};
    default: {
      return state;
    }
  }
};
