import {select} from './create-selectors';

export const overallActivitiesSelector: Selector<OverallActivities> = select<OverallActivities>(
  (store: IRootState) => store.monitoringActivities.overallActivities
);
