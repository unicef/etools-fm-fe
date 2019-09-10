import { Dispatch } from 'redux';
import { getEndpoint } from '../../endpoints/endpoints';
import { RATIONALE } from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';
import { SetRationale, SetRationaleUpdateError, SetRationaleUpdateState } from '../actions/rationale.actions';

export function loadRationale(year: number): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const { url }: IResultEndpoint = getEndpoint(RATIONALE, { year });
        return request<IRationale>(url, { method: 'GET' })
            .then((response: IRationale) => { dispatch(new SetRationale(response)); });
    };
}

export function updateRationale(year: number, rationaleData: Partial<IRationale>): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const endpoint: IResultEndpoint = getEndpoint(RATIONALE, { year });
        const options: RequestInit = { method: 'PATCH', body: JSON.stringify(rationaleData) };

        dispatch(new SetRationaleUpdateState(true));
        return request<IRationale>(endpoint.url, options)
            .then((data: IRationale) => {
                dispatch(new SetRationaleUpdateError({}));
                dispatch(new SetRationale(data));
            })
            .catch((error: any) => { dispatch(new SetRationaleUpdateError(error)); })
            .then(() => { dispatch(new SetRationaleUpdateState(false)); });
    };
}
