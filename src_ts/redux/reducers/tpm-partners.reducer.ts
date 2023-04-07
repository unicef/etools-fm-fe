import {Reducer} from 'redux';
import {TPMPartnersActions, TPMPartnersActionTypes} from '../actions/tpm-partners.actions';

const INITIAL_STATE: ITPMPartnersState = {
  listData: null,
  permissions: null
};

export const tpmPartners: Reducer<ITPMPartnersState, any> = (
  state: ITPMPartnersState = INITIAL_STATE,
  action: TPMPartnersActions
) => {
  switch (action.type) {
    case TPMPartnersActionTypes.SET_TPM_PARTNERS_LIST:
      return {...state, listData: action.payload};
    case TPMPartnersActionTypes.SET_TPM_PARTNERS_PERMISSIONS:
      return {...state, permissions: action.payload};
    default:
      return state;
  }
};
