import {dynamicSelect, select} from './create-selectors';

export const attachmentsListSelector: DynamicSelector<IListData<IAttachment> | undefined> = dynamicSelect<
  IAttachmentsListState,
  IListData<IAttachment>
>((store: IRootState) => store.attachmentsList);

export const listAttachmentUpdate: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.attachmentsList.updateInProcess
);

export const attachmentsTypesSelector: DynamicSelector<AttachmentType[] | undefined> = dynamicSelect<
  AttachmentsTypesState,
  AttachmentType[]
>((store: IRootState) => store.attachmentsList.attachmentsTypes);
