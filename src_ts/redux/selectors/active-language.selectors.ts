import {select} from './create-selectors';

export const activeLanguageSelector: Selector<string> = select<string>(
  (store: IRootState) => store.activeLanguage.activeLanguage
);
