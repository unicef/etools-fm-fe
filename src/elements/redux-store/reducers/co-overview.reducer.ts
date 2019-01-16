import { SET_FULL_REPORT_DATA, SetFullReportData } from '../actions/co-overview.actions';

const INITIAL = {};

export function fullReport(state = INITIAL, action: SetFullReportData) {
    switch (action.type) {
        case SET_FULL_REPORT_DATA:
            return action.payload;
        default:
            return state;
    }
}
