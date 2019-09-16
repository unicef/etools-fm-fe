import { dynamicSelect, select } from './create-selectors';

export const attachmentsListSelector: DynamicSelector<IListData<Attachment> | undefined> =
    dynamicSelect<IAttachmentsListState, IListData<Attachment>>((store: IRootState) => store.attachmentsList);

export const listAttachmentUpdate: Selector<boolean | null> = select<boolean | null>((store: IRootState) => store.attachmentsList.updateInProcess);
