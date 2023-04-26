export enum TPMPartnersActionTypes {
  SET_TPM_PARTNERS_LIST = '[Partners Action]: SET_TPM_PARTNERS_LIST',
  SET_TPM_PARTNERS_PERMISSIONS = '[Partners Action]: SET_TPM_PARTNERS_PERMISSIONS'
}

export class SetTPMPartnersList {
  readonly type: TPMPartnersActionTypes.SET_TPM_PARTNERS_LIST = TPMPartnersActionTypes.SET_TPM_PARTNERS_LIST;

  constructor(public payload: IListData<IActivityTpmPartner>) {}
}

export class SetTPMPartnersPermissions {
  readonly type: TPMPartnersActionTypes.SET_TPM_PARTNERS_PERMISSIONS =
    TPMPartnersActionTypes.SET_TPM_PARTNERS_PERMISSIONS;

  constructor(public payload: GenericObject) {}
}

export type TPMPartnersActions = SetTPMPartnersList | SetTPMPartnersPermissions;
