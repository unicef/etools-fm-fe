import {select} from './create-selectors';

export const hactVisitsSelector: Selector<HactVisits[]> = select<HactVisits[]>(
  (store: IRootState) => store.monitoringActivities.hactVisits
);
