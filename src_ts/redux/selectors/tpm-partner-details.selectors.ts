import {select} from './create-selectors';

export const tpmPartnerDetailsData: Selector<IActivityTpmPartnerExtended | null> =
  select<IActivityTpmPartnerExtended | null>((store: IRootState) => store.tpmPartnerDetails.data);
