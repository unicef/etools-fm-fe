import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import { request } from '../request';
import { AddNotification } from '../actions/notification.actions';
import { SetYearPlanData } from '../actions/year-plan.actions';

export function loadYearPlan(year: number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('yearPlan', {year});
        return request(endpoint.url, {method: 'GET'})
            .catch(() => {
                dispatch(new AddNotification(`Can not Load Year Plan for ${year}`));
                return {results: []};
            })
            .then((yearPlan: YearPlan) => {
                dispatch(new SetYearPlanData(yearPlan));
            });
    };
}