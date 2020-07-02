import {FullReportDataSuccess, FullReportDataFailure, FullReportDataRequest} from '../actions/co-overview.actions';
import {FULL_REPORT} from '../../endpoints/endpoints-list';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {Dispatch} from 'redux';
import {store} from '../store';

export function loadFullReport(id: number): (dispatch: Dispatch) => Promise<void> {
  store.dispatch(new FullReportDataRequest());
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(FULL_REPORT, {id});
    return request<FullReportData>(url, {method: 'GET'})
      .then((response: FullReportData) => {
        dispatch(new FullReportDataSuccess({...response, id}));
      })
      .catch((error: GenericObject) => {
        store.dispatch(new FullReportDataFailure(error));
        throw error;
      });
  };
}
