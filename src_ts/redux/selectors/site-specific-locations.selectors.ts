import { select } from './create-selectors';

export const sitesSelector: Selector<Site[] | null> = select<Site[] | null>(
    (store: IRootState) => store.specificLocations.data && store.specificLocations.data.results
);

export const sitesUpdateSelector: Selector<boolean | null> = select<boolean | null>(
    (store: IRootState) => store.specificLocations.updateInProcess
);
