import {AnyAction, Reducer} from 'redux';
import {TPMPartnerDetailsActions} from '../actions/tpm-partners-details.actions';

const INITIAL: ITPMPartnerDetailsState = {
  isRequest: {
    create: false,
    load: false,
    update: false,
    statusChange: false
  },
  editedCard: null,
  error: null,
  data: null,
  permissions: null,
  attachments: []
};

export const tpmPartnerDetails: Reducer<ITPMPartnerDetailsState, any> = (
  state: ITPMPartnerDetailsState = INITIAL,
  action: AnyAction
) => {
  switch (action.type) {
    case TPMPartnerDetailsActions.SET_EDITED_DETAILS_CARD:
      return {
        ...state,
        editedCard: action.payload
      };

    // DETAILS GET ACTIONS
    case TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_GET_REQUEST: {
      return {
        ...state,
        isRequest: {...state.isRequest, load: true},
        error: null
      };
    }
    case TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_GET_SUCCESS: {
      return {
        ...state,
        isRequest: {...state.isRequest, load: false},
        data: action.payload[0],
        permissions: action.payload[1],
        error: null
      };
    }
    case TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_GET_FAILURE: {
      return {
        ...state,
        isRequest: {...state.isRequest, load: false},
        error: action.payload
      };
    }

    // DETAILS UPDATE ACTIONS
    case TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_UPDATE_REQUEST:
      return {
        ...state,
        isRequest: {...state.isRequest, update: true},
        error: null
      };
    case TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_UPDATE_SUCCESS:
      return {
        ...state,
        isRequest: {...state.isRequest, update: false},
        data: action.payload,
        error: null
      };
    case TPMPartnerDetailsActions.TPM_PARTNER_DETAILS_UPDATE_FAILURE:
      return {
        ...state,
        isRequest: {...state.isRequest, update: false},
        error: action.payload
      };
    case TPMPartnerDetailsActions.ATTACHMENTS_REQUEST:
      return {
        ...state,
        attachments: action.payload
      };
    default:
      return state;
  }
};
