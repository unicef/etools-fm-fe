import { Reducer } from 'redux';
import { QuestionActions, QuestionsAtionTupes } from '../actions/questions.actions';

const INITIAL_STATE: IQuestionsState = {
    error: null,
    data: null,
    updateInProcess: null
};

export const questions: Reducer<IQuestionsState, any> = (state: IQuestionsState = INITIAL_STATE, action: QuestionActions) => {
    switch (action.type) {
        case QuestionsAtionTupes.SET_QUESTIONS_LIST:
            return { ...state, data: action.payload };
        case QuestionsAtionTupes.SET_QUESTION_UPDATE_STATE:
            return { ...state, updateInProcess: action.payload };
        case QuestionsAtionTupes.SET_QUESTION_UPDATE_ERROR:
            return { ...state, error: action.payload };
        default:
            return state;
    }
};
