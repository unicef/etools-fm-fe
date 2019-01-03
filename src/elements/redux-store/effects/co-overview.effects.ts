import { SetFullReportData } from '../actions/co-overview.actions';
import { request } from '../request';
import { Dispatch } from 'redux';
import { getEndpoint } from '../../app-config/app-config';
import { AddNotification } from '../actions/notification.actions';

export function loadFullReport(id: number) {
    return function(dispatch: Dispatch) {
        const endpoint = getEndpoint('fullReport', {id});
        const url = endpoint.url;
        return request(url, {method: 'GET'})
            .then(response => dispatch(new SetFullReportData({id, ...response})))
            .catch(() => {
                dispatch(new AddNotification('Can not Load Full Report'));
                return {results: []};
            });
    };
}
