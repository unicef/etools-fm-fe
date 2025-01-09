import {select} from './create-selectors';

export const questionsListData: Selector<IListData<IQuestion> | null> = select<IListData<IQuestion> | null>(
  (store: IRootState) => store.questions.data
);
export const questionsListDataAll: Selector<IQuestion[] | null> = select<IQuestion[] | null>(
  (store: IRootState) => store.questions.dataAll
);

export const questionUpdate: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.questions.updateInProcess
);
