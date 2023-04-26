import {select} from './create-selectors';

export const tpmPartnersListData: Selector<IListData<IActivityTpmPartner> | null> =
  select<IListData<IActivityTpmPartner> | null>((store: IRootState) => store.tpmPartners.listData);
