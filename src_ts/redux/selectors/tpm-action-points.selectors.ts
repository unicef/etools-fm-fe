import {select} from './create-selectors';

export const tpmActionPointsListSelector: Selector<IListData<TPMActionPoint>> = select<IListData<TPMActionPoint>>(
  (store: IRootState) => store.tpmActionPointsList.data
);

export const tpmActionPointsUpdateStatusSelector: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.tpmActionPointsList.updateInProcess
);
