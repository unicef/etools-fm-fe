import { Dispatch } from 'redux';
import { getEndpoint } from '../../endpoints/endpoints';
import { QUESTIONS_LIST } from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';
import { SetQuestionsList } from '../actions/questions.actions';
import { EtoolsRouter } from '../../routing/routes';

export function loadQuestions(params: IRouteQueryParams): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const { url }: IResultEndpoint = getEndpoint(QUESTIONS_LIST);
        const resultUrl: string = `${url}?${EtoolsRouter.encodeParams(params)}`;
        return request<IListData<Question>>(resultUrl, { method: 'GET' })
            .then((response: IListData<Question>) => { dispatch(new SetQuestionsList(response)); });
    };
}
