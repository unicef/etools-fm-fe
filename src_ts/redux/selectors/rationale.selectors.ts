import {select} from './create-selectors';

export const rationaleData: Selector<IRationale | null> = select<IRationale | null>(
  (store: IRootState) => store.rationale.data
);
export const rationaleUpdate: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.rationale.updateInProcess
);
