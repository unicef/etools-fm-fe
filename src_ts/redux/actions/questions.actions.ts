export enum QuestionsAtionTypes {
    SET_QUESTIONS_LIST = '[Questions Action]: SET_QUESTIONS_LIST',
    SET_QUESTION_UPDATE_STATE = '[Questions Action]: SET_QUESTION_UPDATE_STATE',
    SET_QUESTION_UPDATE_ERROR = '[Questions Action]: SET_QUESTION_UPDATE_ERROR'
}

export class SetQuestionsList {
    public readonly type: QuestionsAtionTypes.SET_QUESTIONS_LIST = QuestionsAtionTypes.SET_QUESTIONS_LIST;
    public constructor(public payload: IListData<IQuestion>) {}
}

export class SetQuestionUpdateState {
    public readonly type: QuestionsAtionTypes.SET_QUESTION_UPDATE_STATE = QuestionsAtionTypes.SET_QUESTION_UPDATE_STATE;
    public constructor(public payload: boolean | null) {}
}

export class SetQuestionUpdateError {
    public readonly type: QuestionsAtionTypes.SET_QUESTION_UPDATE_ERROR = QuestionsAtionTypes.SET_QUESTION_UPDATE_ERROR;
    public constructor(public payload: any) {}
}

export type QuestionActions = SetQuestionsList | SetQuestionUpdateError | SetQuestionUpdateState;
