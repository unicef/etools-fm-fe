import {select} from './create-selectors';

export const dataCollectionChecklistErrorsSelector: Selector<GenericObject | null> = select<GenericObject | null>(
  (store: IRootState) => store.dataCollection.errors.checklist
);

export const dataCollectionList: Selector<DataCollectionChecklist[] | null> = select<DataCollectionChecklist[] | null>(
  (store: IRootState) => store.dataCollection.checklistCollect || null
);

export const dataCollectionChecklistData: Selector<DataCollectionChecklist | null> = select<DataCollectionChecklist | null>(
  (store: IRootState) => store.dataCollection.checklist.data
);

export const findingsAndOverallData: Selector<FindingsAndOverall> = select<FindingsAndOverall>(
  (store: IRootState) => store.dataCollection.checklist.findingsAndOverall
);
