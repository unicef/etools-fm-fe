export enum TemplatesActionTypes {
    SET_QUESTION_TEMPLATES_LIST = '[Templates Action]: SET_QUESTION_TEMPLATES_LIST'
}

export class SetQuestionTemplatesList {
    public readonly type: TemplatesActionTypes.SET_QUESTION_TEMPLATES_LIST =
        TemplatesActionTypes.SET_QUESTION_TEMPLATES_LIST;
    public constructor(public payload: IListData<IQuestionTemplate>) {}
}

export type QuestionTemplatesActions = SetQuestionTemplatesList;
