import {DataCollectionActions, DataCollectionChecklistActionTypes} from '../actions/data-collection.actions';

const propertiesMap: GenericObject<string> = {
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_REQUEST]: 'checklist',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_SUCCESS]: 'checklist',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE]: 'checklist',
  [DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_UPDATE_REQUEST]: 'checklist',
  [DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_REQUEST]: 'findings',
  [DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_SUCCESS]: 'findings',
  [DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_FAILURE]: 'findings',
  [DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_REQUEST]: 'overallAndFindingsUpdate',
  [DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_SUCCESS]: 'overallAndFindingsUpdate',
  [DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_FAILURE]: 'overallAndFindingsUpdate'
};

const INITIAL: IDataCollectionState = {
  loading: {
    checklist: null,
    findings: null,
    overallAndFindingsUpdate: null
  },
  editedFindingsTab: null,
  checklist: {
    data: null,
    findingsAndOverall: {
      findings: null,
      overall: null
    }
  },
  errors: {
    checklist: null,
    findings: null,
    overallAndFindingsUpdate: null
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
      return {
        ...state,
        loading: {...state.loading, [property]: true},
        errors: {...state.errors, [property]: null}
      };

    // Error Actions ------------------------->
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE:
    case DataCollectionChecklistActionTypes.FINDINGS_AND_OVERALL_GET_FAILURE:
    case DataCollectionChecklistActionTypes.OVERALL_AND_FINDINGS_UPDATE_FAILURE:
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
        loading: {...state.loading, overallAndFindingsUpdate: false},
        editedFindingsTab: null
      };

    case DataCollectionChecklistActionTypes.SET_EDITED_CHECKLIST_TAB:
      return {...state, editedFindingsTab: action.payload};

    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_UPDATE_REQUEST:
      return {
        ...state,
        checklist: {data: action.payload, findingsAndOverall: {...state.checklist.findingsAndOverall}}
      };
    default:
      return state;
  }
}
