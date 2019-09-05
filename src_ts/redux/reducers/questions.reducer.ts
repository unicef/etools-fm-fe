import { Reducer } from 'redux';
import { QuestionActions, QuestionsAtionTypes } from '../actions/questions.actions';

const INITIAL_STATE: IQuestionsState = {
    error: {},
    data: null,
    updateInProcess: null
};

export const questions: Reducer<IQuestionsState, any> = (state: IQuestionsState = INITIAL_STATE, action: QuestionActions) => {
    switch (action.type) {
        case QuestionsAtionTypes.SET_QUESTIONS_LIST:
            return { ...state, data: action.payload };
        case QuestionsAtionTypes.SET_QUESTION_UPDATE_STATE:
            return { ...state, updateInProcess: action.payload };
        case QuestionsAtionTypes.SET_QUESTION_UPDATE_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
