import {select} from './create-selectors';

export const activityDetailsData: Selector<IActivityDetails | null> = select<IActivityDetails | null>(
  (store: IRootState) => store.activityDetails.data
);

export const activityDetailsIsLoad: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.activityDetails.isRequest.load
);

export const activityDetailsIsUpdate: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.activityDetails.isRequest.update
);

export const detailsEditedCard: Selector<string | null> = select<string | null>(
  (store: IRootState) => store.activityDetails.editedCard
);

export const activityStatusIsChanging: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.activityDetails.isRequest.statusChange
);

export const activityDetailsError: Selector<null | GenericObject> = select<null | GenericObject>(
  (store: IRootState) => store.activityDetails.error
);

export const activityChecklistAttachments: Selector<IChecklistAttachment[]> = select<IChecklistAttachment[]>(
  (store: IRootState) => store.activityDetails.checklistAttachments
);

export const activityChecklistAttachmentsTypes: Selector<AttachmentType[]> = select<AttachmentType[]>(
  (store: IRootState) => store.activityDetails.checklistAttachmentsTypes
);
