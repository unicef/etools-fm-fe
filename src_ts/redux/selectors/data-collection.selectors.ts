import {dynamicSelect, select} from './create-selectors';

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

export const dataCollectionMethods: Selector<null | IDataCollectionMethods> = select<null | IDataCollectionMethods>(
  (store: IRootState) => store.dataCollection.dataCollectionMethods
);

export const dataCollectionLoading: DynamicSelector<boolean | undefined> = dynamicSelect<
  GenericObject<null | boolean>,
  boolean
>((store: IRootState) => store.dataCollection.loading);

export const dataCollectionChecklistBlueprint: Selector<ChecklistFormJson | null> = select<ChecklistFormJson | null>(
  (store: IRootState) => store.dataCollection.checklist.blueprint
);
