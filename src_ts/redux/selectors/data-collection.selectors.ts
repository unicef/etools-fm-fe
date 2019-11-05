import {select} from './create-selectors';

export const dataCollectionChecklistData: Selector<DataCollectionChecklist | null> = select<DataCollectionChecklist | null>(
  (store: IRootState) => store.dataCollection.checklist.data
);
