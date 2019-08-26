import { select } from './create-selectors';

export const questionsListData: Selector<IListData<Question> | null> = select<IListData<Question> | null>((store: IRootState) => store.questions.data);
