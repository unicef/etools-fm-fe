export enum QuestionsAtionTupes {
    SET_QUESTIONS_LIST = '[Questions Action]: SET_QUESTIONS_LIST',
    SET_QUESTION_UPDATE_STATE = '[Questions Action]: SET_QUESTION_UPDATE_STATE',
    SET_QUESTION_UPDATE_ERROR = '[Questions Action]: SET_QUESTION_UPDATE_ERROR'
}

export class SetQuestionsList {
    public readonly type: QuestionsAtionTupes.SET_QUESTIONS_LIST = QuestionsAtionTupes.SET_QUESTIONS_LIST;
    public constructor(public payload: IListData<Question>) {}
}

export class SetQuestionUpdateState {
    public readonly type: QuestionsAtionTupes.SET_QUESTION_UPDATE_STATE = QuestionsAtionTupes.SET_QUESTION_UPDATE_STATE;
    public constructor(public payload: boolean) {}
}

export class SetQuestionUpdateError {
    public readonly type: QuestionsAtionTupes.SET_QUESTION_UPDATE_ERROR = QuestionsAtionTupes.SET_QUESTION_UPDATE_ERROR;
    public constructor(public payload: any) {}
}

export type QuestionActions = SetQuestionsList | SetQuestionUpdateError | SetQuestionUpdateState;
