import {select} from './create-selectors';

export const actionPointsListSelector: Selector<ActionPoint[]> = select<ActionPoint[]>(
  (store: IRootState) => store.actionPointsList.data
);

export const actionPointsUpdateStatusSelector: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.actionPointsList.updateInProcess
);
