import {select} from './create-selectors';

export const openIssuesLocationsSelector: Selector<OpenIssuesActionPoints[]> = select<OpenIssuesActionPoints[]>(
  (store: IRootState) => store.monitoringActivities.openIssuesLocation
);
