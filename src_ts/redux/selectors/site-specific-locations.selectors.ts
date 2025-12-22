import {select} from './create-selectors';

export const sitesUpdateSelector: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.specificLocations.updateInProcess
);
