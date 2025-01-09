export enum QuestionsActionTypes {
  SET_QUESTIONS_LIST = '[Questions Action]: SET_QUESTIONS_LIST',
  SET_QUESTIONS_LIST_ALL = '[Questions Action]: SET_QUESTIONS_LIST_ALL',
  SET_QUESTION_UPDATE_STATE = '[Questions Action]: SET_QUESTION_UPDATE_STATE',
  SET_QUESTION_UPDATE_ERROR = '[Questions Action]: SET_QUESTION_UPDATE_ERROR'
}

export class SetQuestionsList {
  readonly type: QuestionsActionTypes.SET_QUESTIONS_LIST = QuestionsActionTypes.SET_QUESTIONS_LIST;

  constructor(public payload: IListData<IQuestion>) {}
}

export class SetQuestionsListAll {
  readonly type: QuestionsActionTypes.SET_QUESTIONS_LIST_ALL = QuestionsActionTypes.SET_QUESTIONS_LIST_ALL;

  constructor(public payload: IQuestion[]) {}
}

export class SetQuestionUpdateState {
  readonly type: QuestionsActionTypes.SET_QUESTION_UPDATE_STATE = QuestionsActionTypes.SET_QUESTION_UPDATE_STATE;

  constructor(public payload: boolean | null) {}
}

export class SetQuestionUpdateError {
  readonly type: QuestionsActionTypes.SET_QUESTION_UPDATE_ERROR = QuestionsActionTypes.SET_QUESTION_UPDATE_ERROR;

  constructor(public payload: any) {}
}

export type QuestionActions = SetQuestionsList | SetQuestionsListAll | SetQuestionUpdateError | SetQuestionUpdateState;
