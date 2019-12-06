export enum DataCollectionChecklistActionTypes {
  DATA_COLLECTION_CREATE_REQUEST = '[Data Collection Checklist Action]: DATA_COLLECTION_CREATE_REQUEST',
  DATA_COLLECTION_CREATE_SUCCESS = '[Data Collection Checklist Action]: DATA_COLLECTION_CREATE_SUCCESS',
  DATA_COLLECTION_CREATE_FAILURE = '[Data Collection Checklist Action]: DATA_COLLECTION_CREATE_FAILURE',

  DATA_COLLECTION_UPDATE_REQUEST = '[Data Collection Checklist Action]: DATA_COLLECTION_UPDATE_REQUEST',
  DATA_COLLECTION_UPDATE_SUCCESS = '[Data Collection Checklist Action]: DATA_COLLECTION_UPDATE_SUCCESS',
  DATA_COLLECTION_UPDATE_FAILURE = '[Data Collection Checklist Action]: DATA_COLLECTION_UPDATE_FAILURE',

  DATA_COLLECTION_LIST_REQUEST = '[Data Collection Checklist Action]: DATA_COLLECTION_LIST_REQUEST',
  DATA_COLLECTION_LIST_SUCCESS = '[Data Collection Checklist Action]: DATA_COLLECTION_LIST_SUCCESS',
  DATA_COLLECTION_LIST_FAILURE = '[Data Collection Checklist Action]: DATA_COLLECTION_LIST_FAILURE',

  DATA_COLLECTION_CHECKLIST_GET_REQUEST = '[Data Collection Checklist Action]: DATA_COLLECTION_CHECKLIST_GET_REQUEST',
  DATA_COLLECTION_CHECKLIST_GET_SUCCESS = '[Data Collection Checklist Action]: DATA_COLLECTION_CHECKLIST_GET_SUCCESS',
  DATA_COLLECTION_CHECKLIST_GET_FAILURE = '[Data Collection Checklist Action]: DATA_COLLECTION_CHECKLIST_GET_FAILURE',
  DATA_COLLECTION_CHECKLIST_UPDATE_REQUEST = '[Data Collection Checklist Action]: DATA_COLLECTION_CHECKLIST_UPDATE_REQUEST',

  FINDINGS_AND_OVERALL_GET_REQUEST = '[Data Collection Checklist Action]: FINDINGS_AND_OVERALL_GET_REQUEST',
  FINDINGS_AND_OVERALL_GET_SUCCESS = '[Data Collection Checklist Action]: FINDINGS_AND_OVERALL_GET_SUCCESS',
  FINDINGS_AND_OVERALL_GET_FAILURE = '[Data Collection Checklist Action]: FINDINGS_AND_OVERALL_GET_FAILURE',

  OVERALL_AND_FINDINGS_UPDATE_REQUEST = '[Data Collection Checklist Action]: OVERALL_AND_FINDINGS_UPDATE_REQUEST',
  OVERALL_AND_FINDINGS_UPDATE_SUCCESS = '[Data Collection Checklist Action]: OVERALL_AND_FINDINGS_UPDATE_SUCCESS',
  OVERALL_AND_FINDINGS_UPDATE_FAILURE = '[Data Collection Checklist Action]: OVERALL_AND_FINDINGS_UPDATE_FAILURE'
}

export class SetChecklistInformationSource {
  type: DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_UPDATE_REQUEST =
    DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_UPDATE_REQUEST;
  constructor(public payload: DataCollectionChecklist) {}
}

export class SetChecklistError {
  type: DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE =
    DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE;
  constructor(public payload: GenericObject) {}
}

export type DataCollectionActions =
  | MiddlewareLoadingAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_REQUEST>
  | MiddlewareRequestAction<
      DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_SUCCESS,
      DataCollectionChecklist
    >
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_REQUEST>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_SUCCESS>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_FAILURE>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_REQUEST>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_SUCCESS>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_FAILURE>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_REQUEST>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_SUCCESS>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_FAILURE>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_UPDATE_REQUEST>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_UPDATE_SUCCESS>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_UPDATE_FAILURE>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_REQUEST>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_SUCCESS>
  | MiddlewareRequestAction<DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_FAILURE>
  | SetChecklistInformationSource
  | SetChecklistError;
