export enum QuestionsActionTypes {
    SET_QUESTIONS_LIST = '[Questions Action]: SET_QUESTIONS_LIST',
    SET_QUESTION_UPDATE_STATE = '[Questions Action]: SET_QUESTION_UPDATE_STATE',
    SET_QUESTION_UPDATE_ERROR = '[Questions Action]: SET_QUESTION_UPDATE_ERROR'
}

export class SetQuestionsList {
    public readonly type: QuestionsActionTypes.SET_QUESTIONS_LIST = QuestionsActionTypes.SET_QUESTIONS_LIST;
    public constructor(public payload: IListData<IQuestion>) {}
}

export class SetQuestionUpdateState {
    public readonly type: QuestionsActionTypes.SET_QUESTION_UPDATE_STATE =
        QuestionsActionTypes.SET_QUESTION_UPDATE_STATE;
    public constructor(public payload: boolean | null) {}
}

export class SetQuestionUpdateError {
    public readonly type: QuestionsActionTypes.SET_QUESTION_UPDATE_ERROR =
        QuestionsActionTypes.SET_QUESTION_UPDATE_ERROR;
    public constructor(public payload: any) {}
}

export type QuestionActions = SetQuestionsList | SetQuestionUpdateError | SetQuestionUpdateState;
