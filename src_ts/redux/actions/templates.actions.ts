export enum TemplatesActionTypes {
  SET_QUESTION_TEMPLATES_LIST = '[Templates Action]: SET_QUESTION_TEMPLATES_LIST'
}

export class SetQuestionTemplatesList {
  readonly type: TemplatesActionTypes.SET_QUESTION_TEMPLATES_LIST = TemplatesActionTypes.SET_QUESTION_TEMPLATES_LIST;

  constructor(public payload: IListData<IQuestionTemplate>) {}
}

export type QuestionTemplatesActions = SetQuestionTemplatesList;
