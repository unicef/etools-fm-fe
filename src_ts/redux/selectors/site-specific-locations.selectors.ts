import {select} from './create-selectors';

export const sitesSelector: Selector<IListData<Site> | null> = select<IListData<Site> | null>(
  (store: IRootState) => store.specificLocations.data
);

export const sitesUpdateSelector: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.specificLocations.updateInProcess
);
