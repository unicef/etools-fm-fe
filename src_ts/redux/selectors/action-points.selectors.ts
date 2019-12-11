import {select} from './create-selectors';

export const actionPointsListSelector: Selector<ActionPoint[]> = select<ActionPoint[]>(
  (store: IRootState) => store.actionPointsList.data
);

export const actionPointsUpdateSelector: Selector<boolean> = select<boolean>(
  (store: IRootState) => store.actionPointsList.isUpdateSuccessful
);

export const actionPointsUpdateStatusSelector: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.actionPointsList.updateInProcess
);
