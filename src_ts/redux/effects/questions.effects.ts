import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {QUESTIONS_DETAILS, QUESTIONS_LIST} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {SetQuestionsList, SetQuestionUpdateError, SetQuestionUpdateState} from '../actions/questions.actions';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {EtoolsRouteQueryParams} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

export function loadQuestions(params: EtoolsRouteQueryParams): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(QUESTIONS_LIST);
    const resultUrl = `${url}?${EtoolsRouter.encodeQueryParams(params)}`;
    return request<IListData<IQuestion>>(resultUrl, {method: 'GET'}).then((response: IListData<IQuestion>) => {
      dispatch(new SetQuestionsList(response));
    });
  };
}

export function updateQuestion(id: number, question: IEditedQuestion): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(QUESTIONS_DETAILS, {id});
    return startRequest(dispatch, endpoint.url, 'PATCH', question);
  };
}

export function addQuestion(question: IEditedQuestion): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(QUESTIONS_LIST);
    return startRequest(dispatch, endpoint.url, 'POST', question);
  };
}

function startRequest(
  dispatch: Dispatch,
  url: string,
  method: RequestMethod,
  data: Partial<IEditedQuestion>
): Promise<void> {
  dispatch(new SetQuestionUpdateState(true));

  const options: RequestInit = {method, body: JSON.stringify(data)};
  return request(url, options)
    .then(() => dispatch(new SetQuestionUpdateError({})))
    .catch((error: any) => dispatch(new SetQuestionUpdateError(error.data || error)))
    .then(() => {
      dispatch(new SetQuestionUpdateState(false));
    });
}
