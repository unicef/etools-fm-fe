export enum TemplatesActionTypes {
    SET_QUESTION_TEMPLATES_LIST = '[Templates Action]: SET_QUESTION_TEMPLATES_LIST'
}

export class SetQuestionTemplatesList {
    public readonly type: TemplatesActionTypes.SET_QUESTION_TEMPLATES_LIST =
        TemplatesActionTypes.SET_QUESTION_TEMPLATES_LIST;
    public constructor(public payload: IListData<IQuestionTemplate>) {}
}

// export class SetQuestionUpdateState {
//     public readonly type: TemplatesAtionTypes.SET_QUESTION_UPDATE_STATE = QuestionsAtionTypes.SET_QUESTION_UPDATE_STATE;
//     public constructor(public payload: boolean | null) {}
// }
//
// export class SetQuestionUpdateError {
//     public readonly type: TemplatesAtionTypes.SET_QUESTION_UPDATE_ERROR = QuestionsAtionTypes.SET_QUESTION_UPDATE_ERROR;
//     public constructor(public payload: any) {}
// }

export type QuestionTemplatesActions = SetQuestionTemplatesList;
