import { Reducer } from 'redux';
import { QuestionTemplatesActions, TemplatesActionTypes } from '../actions/templates.actions';

const INITIAL_STATE: IQuestionTemplatesState = {
    data: null
};

export const questionTemplates: Reducer<IQuestionTemplatesState, any> = (state: IQuestionTemplatesState = INITIAL_STATE, action: QuestionTemplatesActions) => {
    switch (action.type) {
        case TemplatesActionTypes.SET_QUESTION_TEMPLATES_LIST:
            return { ...state, data: action.payload };
        default:
            return state;
    }
};
