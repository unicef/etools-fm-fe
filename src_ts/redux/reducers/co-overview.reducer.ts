import {Reducer} from 'redux';

import {CountryOverviewActions, CountryOverviewActionTypes} from '../actions/co-overview.actions';

const initialState: IFullReportState = null;

export const fullReport: Reducer<IFullReportState, any> = (
  state: IFullReportState = initialState,
  action: CountryOverviewActions
) => {
  switch (action.type) {
    case CountryOverviewActionTypes.SET_FULL_REPORT_DATA:
      return action.payload;
    default: {
      return state;
    }
  }
};
