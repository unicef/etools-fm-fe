import {
    FINISH_REQUEST_YEAR_PLAN,
    SET_YEAR_PLAN_DATA,
    START_REQUEST_YEAR_PLAN,
    YearPlanActions
} from '../actions/year-plan.actions';

const INITIAL = {};

export function yearPlan(state = INITIAL, action: YearPlanActions) {
    switch (action.type) {
        case SET_YEAR_PLAN_DATA:
            const data = {...action.payload};
            return Object.assign({}, state, {data});
        case START_REQUEST_YEAR_PLAN:
            return Object.assign({}, state, {requestInProcess: true});
        case FINISH_REQUEST_YEAR_PLAN:
            return Object.assign({}, state, {requestInProcess: false});
        default:
            return state;
    }
}
