import {select} from './create-selectors';

export const tpmPartnersListData: Selector<IListData<IActivityTpmPartner> | null> =
  select<IListData<IActivityTpmPartner> | null>((store: IRootState) => store.tpmPartners.listData);

export const tpmPartnersPermissions: Selector<GenericObject | null> = select<GenericObject | null>(
  (store: IRootState) => store.tpmPartners.permissions
);
