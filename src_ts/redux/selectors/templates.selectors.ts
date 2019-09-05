import { select } from './create-selectors';

export const questionTemplatesListData: Selector<IListData<IQuestionTemplate> | null> =
    select<IListData<IQuestionTemplate> | null>((store: IRootState) => store.questionTemplates.data);
