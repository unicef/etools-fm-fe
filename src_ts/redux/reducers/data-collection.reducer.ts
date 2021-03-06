import {DataCollectionActions, DataCollectionChecklistActionTypes} from '../actions/data-collection.actions';

const propertiesMap: GenericObject<string> = {
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_REQUEST]: 'checklistCreate',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_SUCCESS]: 'checklistCreate',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_FAILURE]: 'checklistCreate',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_REQUEST]: 'checklistCollect',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_SUCCESS]: 'checklistCollect',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_FAILURE]: 'checklistCollect',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_REQUEST]: 'checklist',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_SUCCESS]: 'checklist',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE]: 'checklist',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_UPDATE_REQUEST]: 'checklist',
  [DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_REQUEST]: 'findings',
  [DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_SUCCESS]: 'findings',
  [DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_FAILURE]: 'findings',
  [DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_REQUEST]: 'overallAndFindingsUpdate',
  [DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_SUCCESS]: 'overallAndFindingsUpdate',
  [DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_FAILURE]: 'overallAndFindingsUpdate',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_METHODS_REQUEST]: 'dataCollectionMethods',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_METHODS_SUCCESS]: 'dataCollectionMethods',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_METHODS_FAILURE]: 'dataCollectionMethods',
  [DataCollectionChecklistActionTypes.LOAD_BLUEPRINT]: 'blueprint'
};

const INITIAL: IDataCollectionState = {
  loading: {
    checklistCollect: null,
    checklistCreate: null,
    checklist: null,
    findings: null,
    dataCollectionMethods: null,
    overallAndFindingsUpdate: null
  },
  checklistCollect: [],
  dataCollectionMethods: null,
  checklist: {
    blueprint: null,
    data: null,
    findingsAndOverall: {
      findings: null,
      overall: null
    },
    removalInProgress: false
  },
  errors: {
    checklistCollect: null,
    checklistCreate: null,
    checklist: null,
    findings: null,
    dataCollectionMethods: null,
    overallAndFindingsUpdate: null,
    dataCollectionChecklistItemRemovalFailure: null
  }
};

export function dataCollection(
  state: IDataCollectionState = INITIAL,
  action: DataCollectionActions
): IDataCollectionState {
  const property: string = propertiesMap[action.type];
  switch (action.type) {
    // Loading Actions ------------------------->
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_REQUEST:
    case DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_REQUEST:
    case DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_REQUEST:
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_REQUEST:
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_REQUEST:
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_METHODS_REQUEST:
      return {
        ...state,
        loading: {...state.loading, [property]: true},
        errors: {...state.errors, [property]: null}
      };

    // Error Actions ------------------------->
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE:
    case DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_FAILURE:
    case DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_FAILURE:
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_FAILURE:
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_FAILURE:
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_METHODS_FAILURE:
      return {
        ...state,
        loading: {...state.loading, [property]: false},
        errors: {...state.errors, [property]: action.payload}
      };

    // Checklist data ------------------------->
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_SUCCESS:
      return {
        ...state,
        loading: {...state.loading, checklist: false},
        checklist: {...state.checklist, data: action.payload}
      };

    // Findings and Overall data ------------------------->
    case DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_SUCCESS:
      return {
        ...state,
        loading: {...state.loading, findings: false},
        checklist: {...state.checklist, findingsAndOverall: {...state.checklist.findingsAndOverall, ...action.payload}}
      };

    // Overall Finding Update ------------------------->
    case DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_SUCCESS:
      return {
        ...state,
        loading: {...state.loading, overallAndFindingsUpdate: false}
      };

    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CREATE_SUCCESS:
      return {
        ...state,
        loading: {...state.loading, [property]: false},
        checklistCollect: [...state.checklistCollect, action.payload]
      };

    case DataCollectionChecklistActionTypes.DATA_COLLECTION_LIST_SUCCESS:
      return {
        ...state,
        loading: {...state.loading, [property]: false},
        checklistCollect: [...action.payload]
      };

    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_UPDATE_REQUEST:
      return {
        ...state,
        checklist: {
          data: action.payload,
          findingsAndOverall: {...state.checklist.findingsAndOverall},
          blueprint: state.checklist.blueprint,
          removalInProgress: state.checklist.removalInProgress
        }
      };

    case DataCollectionChecklistActionTypes.DATA_COLLECTION_METHODS_SUCCESS:
      return {
        ...state,
        loading: {...state.loading, [property]: false},
        dataCollectionMethods: action.payload
      };

    case DataCollectionChecklistActionTypes.LOAD_BLUEPRINT:
      return {
        ...state,
        checklist: {
          blueprint: action.payload,
          data: state.checklist.data,
          removalInProgress: state.checklist.removalInProgress,
          findingsAndOverall: {...state.checklist.findingsAndOverall}
        }
      };

    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_ITEM_REMOVAL_IN_PROGRESS:
      return {
        ...state,
        checklist: {
          ...state.checklist,
          removalInProgress: action.payload
        }
      };

    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_ITEM_REMOVAL_FAILURE:
      return {
        ...state,
        errors: {
          ...state.errors,
          dataCollectionChecklistItemRemovalFailure: action.payload
        }
      };

    default:
      return state;
  }
}
