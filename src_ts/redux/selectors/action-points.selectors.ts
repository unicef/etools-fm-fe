import {select} from './create-selectors';

export const actionPointsListSelector: Selector<IListData<ActionPoint>> = select<IListData<ActionPoint>>(
  (store: IRootState) => store.actionPointsList.data
);

export const actionPointsUpdateStatusSelector: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.actionPointsList.updateInProcess
);
