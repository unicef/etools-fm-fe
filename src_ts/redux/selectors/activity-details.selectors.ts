import { select } from './create-selectors';

export const activityDetailsData: Selector<IActivityDetails | null> =
    select<IActivityDetails | null>((store: IRootState) => store.activityDetails.data);

export const activityDetailsIsLoad: Selector<boolean | null> =
    select<boolean | null>((store: IRootState) => store.activityDetails.isRequest.load);

export const activityDetailsIsUpdate: Selector<boolean | null> =
    select<boolean | null>((store: IRootState) => store.activityDetails.isRequest.update);

export const detailsEditedCard: Selector<string | null> =
    select<string | null>((store: IRootState) => store.activityDetails.editedCard);
