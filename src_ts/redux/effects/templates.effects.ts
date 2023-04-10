import {Dispatch} from 'redux';
import {getEndpoint} from '../../endpoints/endpoints';
import {QUESTION_TEMPLATES, QUESTION_TEMPLATES_WITH_TARGET} from '../../endpoints/endpoints-list';
import {request} from '../../endpoints/request';
import {SetQuestionTemplatesList} from '../actions/templates.actions';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import { EtoolsRouteQueryParams } from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

export function loadQuestionTemplates(
  params: EtoolsRouteQueryParams,
  level: string,
  target?: string
): (dispatch: Dispatch) => Promise<void> {
  return (dispatch: Dispatch) => {
    const endpointName: string = target ? QUESTION_TEMPLATES_WITH_TARGET : QUESTION_TEMPLATES;
    const {url}: IResultEndpoint = getEndpoint(endpointName, {level, target});
    const resultUrl = `${url}?${EtoolsRouter.encodeQueryParams(params)}`;
    return request<IListData<IQuestionTemplate>>(resultUrl, {method: 'GET'}).then(
      (response: IListData<IQuestionTemplate>) => {
        dispatch(new SetQuestionTemplatesList(response));
      }
    );
  };
}
