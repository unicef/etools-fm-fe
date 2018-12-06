import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import {
    FinishRequestYearPlan,
    SetYearPlanData,
    StartRequestYearPlan
} from '../actions/year-plan.actions';

export function loadYearPlan(year: number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('yearPlan', {year});
        dispatch(new StartRequestYearPlan());
        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification(`Can not Load Year Plan for ${year}`));
                return {results: []};
            })
            .then((yearPlan: YearPlan) =>  dispatch(new SetYearPlanData(yearPlan)))
            .then(() => dispatch(new FinishRequestYearPlan()));
    };
}

export function updateYearPlan(year: number, data: YearPlan) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('yearPlan', {year});
        const options = {
            method: 'PATCH',
            body: JSON.stringify(data),
            headers: {'Content-Type': 'application/json'}
        };
        dispatch(new StartRequestYearPlan());
        return request(endpoint.url, options)
            .catch(() => {
                dispatch(new AddNotification(`Can not update Year Plan for ${year}`));
                return {results: []};
            })
            .then((yearPlan: YearPlan) => dispatch(new SetYearPlanData(yearPlan)))
            .then(() => dispatch(new FinishRequestYearPlan()));
    };
}
