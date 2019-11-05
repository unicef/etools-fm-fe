export enum DataCollectionChecklistActionTypes {
  DATA_COLLECTION_CHECKLIST_GET_REQUEST = '[Data Collection Checklist Action]: DATA_COLLECTION_CHECKLIST_GET_REQUEST',
  DATA_COLLECTION_CHECKLIST_GET_SUCCESS = '[Data Collection Checklist Action]: DATA_COLLECTION_CHECKLIST_GET_SUCCESS',
  DATA_COLLECTION_CHECKLIST_GET_FAILURE = '[Data Collection Checklist Action]: DATA_COLLECTION_CHECKLIST_GET_FAILURE'
}

export type DataCollectionActions =
  | MiddlewareLoadingAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_REQUEST>
  | MiddlewareRequestAction<
      DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_SUCCESS,
      DataCollectionChecklist
    >
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE>;
