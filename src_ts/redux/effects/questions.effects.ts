import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {QUESTIONS_DETAILS, QUESTIONS_LIST, QUESTIONS_ORDER} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {
  SetQuestionsList,
  SetQuestionsListAll,
  SetQuestionUpdateError,
  SetQuestionUpdateState
} from '../actions/questions.actions';
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

export function loadQuestionsAll(): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const {url}: IResultEndpoint = getEndpoint(QUESTIONS_LIST);
    const resultUrl = `${url}?page_size=all`;
    return request<IQuestion[]>(resultUrl, {method: 'GET'}).then((response: IQuestion[]) => {
      dispatch(new SetQuestionsListAll(response));
    });
  };
}

export function updateQuestion(id: number, question: IEditedQuestion): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(QUESTIONS_DETAILS, {id});
    return startRequest(dispatch, endpoint.url, 'PATCH', question);
  };
}

export function updateQuestionOrders(
  questionOrders: {id: number; order: number}[]
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpoint: IResultEndpoint = getEndpoint(QUESTIONS_ORDER);
    return startRequest(dispatch, endpoint.url, 'PATCH', questionOrders);
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
  data: Partial<IEditedQuestion> | any
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
