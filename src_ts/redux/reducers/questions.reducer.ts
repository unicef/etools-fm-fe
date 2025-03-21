import {Reducer} from 'redux';
import {QuestionActions, QuestionsActionTypes} from '../actions/questions.actions';

const INITIAL_STATE: IQuestionsState = {
  error: {},
  data: null,
  dataAll: null,
  updateInProcess: null
};

export const questions: Reducer<IQuestionsState, any> = (
  state: IQuestionsState = INITIAL_STATE,
  action: QuestionActions
) => {
  switch (action.type) {
    case QuestionsActionTypes.SET_QUESTIONS_LIST:
      return {...state, data: action.payload};
    case QuestionsActionTypes.SET_QUESTIONS_LIST_ALL:
      return {...state, dataAll: action.payload};
    case QuestionsActionTypes.SET_QUESTION_UPDATE_STATE:
      return {...state, updateInProcess: action.payload};
    case QuestionsActionTypes.SET_QUESTION_UPDATE_ERROR:
      return {...state, error: action.payload};
    default:
      return state;
  }
};
