import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {request} from '../../endpoints/request';
import {ACTIVITY_CHECKLIST} from '../../endpoints/endpoints-list';
import {SetActivityChecklist} from '../actions/activity-checklist.actions';

export function loadActivityChecklist(id: number, enabled?: true): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTIVITY_CHECKLIST, {id});
    const enabledParam: string = enabled ? '&is_enabled=True' : '';
    return request<IChecklistItem[]>(`${url}?page_size=all${enabledParam}`, {method: 'GET'}).then(
      (response: IChecklistItem[]) => {
        dispatch(new SetActivityChecklist(response));
      }
    );
  };
}

export function updateActivityChecklist(
  id: number,
  data: Partial<IChecklistItem>[]
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(ACTIVITY_CHECKLIST, {id});
    return request<IListData<IChecklistItem>>(url, {method: 'PATCH', body: JSON.stringify(data)}).then(() => {
      dispatch<AsyncEffect>(loadActivityChecklist(id));
    });
  };
}
