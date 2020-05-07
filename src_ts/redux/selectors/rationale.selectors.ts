import {select} from './create-selectors';

export const rationaleData: Selector<IRationale | null> = select<IRationale | null>(
  (store: IRootState) => store.rationale.data
);
export const rationaleUpdate: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.rationale.updateInProcess
);

export const rationaleUpdateError: Selector<GenericObject | null> = select<GenericObject | null>(
  (store: IRootState) => store.rationale.error
);
