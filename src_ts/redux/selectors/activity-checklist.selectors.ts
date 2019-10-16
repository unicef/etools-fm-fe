import { select } from './create-selectors';

export const activityChecklistData: Selector<IChecklistItem[] | null> =
    select<IChecklistItem[] | null>((store: IRootState) => store.activityChecklist.data || null);

export const checklistEditedCard: Selector<string | null> =
    select<string | null>((store: IRootState) => store.activityChecklist.editedCard);
