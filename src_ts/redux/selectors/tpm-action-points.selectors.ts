import {select} from './create-selectors';

export const tpmActionPointsListSelector: Selector<TPMActionPoint[]> = select<TPMActionPoint[]>(
  (store: IRootState) => store.tpmActionPointsList.data
);

export const tpmActionPointsUpdateStatusSelector: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.tpmActionPointsList.updateInProcess
);
