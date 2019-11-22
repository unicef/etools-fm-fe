import {AnyAction} from 'redux';

const INITIAL: IAdditionalInfoState = {
  errors: {
    issueTracking: null
  },
  issueTracking: [],
  isRequest: {
    issueTrackingLoad: null
  }
};

export function additionalInfo(state: IAdditionalInfoState = INITIAL, action: AnyAction): IAdditionalInfoState {
  switch (action.type) {
    default:
      return state;
  }
}
