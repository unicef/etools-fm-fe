import { Dispatch } from 'redux';
import { getEndpoint } from '../../endpoints/endpoints';
import { request } from '../../endpoints/request';
import { FULL_REPORT } from '../../endpoints/endpoints-list';
import { SetFullReportData } from '../actions/co-overview.actions';

export function loadFullReport(id: number): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const { url }: IResultEndpoint = getEndpoint(FULL_REPORT, { id });
        return request<FullReportData>(url, { method: 'GET' })
            .then((response: FullReportData) => { dispatch(new SetFullReportData({ id, ...response })); });
    };
}
