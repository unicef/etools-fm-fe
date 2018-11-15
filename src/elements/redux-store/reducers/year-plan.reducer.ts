import { SET_YEAR_PLAN_DATA, YearPlanActions } from '../actions/year-plan.actions';

const INITIAL = {};

export function yearPlan(state = INITIAL, action: YearPlanActions) {
    switch (action.type) {
        case SET_YEAR_PLAN_DATA:
            const data = {...action.payload};
            return Object.assign({}, state, {data});
        default:
            return state;
    }
}