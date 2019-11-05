import {Reducer} from 'redux';
import {DataCollectionActions, DataCollectionChecklistActionTypes} from '../actions/data-collection.actions';

const INITIAL: IDataCollectionState = {
  checklistLoading: null,
  checklist: {
    data: null,
    findings: null,
    overallFindings: null
  },
  checklistError: null
};

export const dataCollection: Reducer<IDataCollectionState, any> = (
  state: IDataCollectionState = INITIAL,
  action: DataCollectionActions
) => {
  switch (action.type) {
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_REQUEST:
      return {...state, checklistLoading: true, checklistError: null};
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_SUCCESS:
      return {
        ...state,
        checklistLoading: false,
        checklist: {...state.checklist, data: action.payload}
      };
    case DataCollectionChecklistActionTypes.DATA_COLLECTION_CHECKLIST_GET_FAILURE:
      return {
        ...state,
        checklistLoading: false,
        checklistError: action.payload
      };
    default:
      return state;
  }
};
