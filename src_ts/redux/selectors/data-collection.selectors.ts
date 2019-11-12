import {select} from './create-selectors';

export const dataCollectionChecklistData: Selector<DataCollectionChecklist | null> = select<DataCollectionChecklist | null>(
  (store: IRootState) => store.dataCollection.checklist.data
);

export const findingsAndOverallData: Selector<FindingsAndOverall> = select<FindingsAndOverall>(
  (store: IRootState) => store.dataCollection.checklist.findingsAndOverall
);

export const editedFindingsTab: Selector<null | string> = select<null | string>(
  (store: IRootState) => store.dataCollection.editedFindingsTab
);

export const updateOverallAndFindingsState: Selector<null | boolean> = select<null | boolean>(
  (store: IRootState) => store.dataCollection.loading.overallAndFindingsUpdate
);
