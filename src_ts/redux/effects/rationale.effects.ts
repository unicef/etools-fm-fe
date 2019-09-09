import { Dispatch } from 'redux';
import { getEndpoint } from '../../endpoints/endpoints';
import { RATIONALE } from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';
import { SetRationale } from '../actions/rationale.actions';

export function loadRationale(year: number): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const { url }: IResultEndpoint = getEndpoint(RATIONALE, { year });
        return request<IRationale>(url, { method: 'GET' })
            .then((response: IRationale) => { dispatch(new SetRationale(response)); });
    };
}
