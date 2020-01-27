import {Reducer} from 'redux';
import {ActiveLanguageActionTypes, ActiveLanguageTypes} from '../actions/active-language.actions';

const INITIAL_STATE: IActiveLanguageState = {
  activeLanguage: 'en'
};

export const activeLanguage: Reducer<IActiveLanguageState, any> = (
  state: IActiveLanguageState = INITIAL_STATE,
  action: ActiveLanguageTypes
) => {
  switch (action.type) {
    case ActiveLanguageActionTypes.ACTIVE_LANGUAGE_SWITCHED:
      return {...state, activeLanguage: action.payload};
    default:
      return state;
  }
};
