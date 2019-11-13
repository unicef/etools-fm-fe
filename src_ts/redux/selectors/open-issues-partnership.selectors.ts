import {select} from './create-selectors';

export const openIssuesPartnershipSelector: Selector<OpenIssuesActionPoints[]> = select<OpenIssuesActionPoints[]>(
  (store: IRootState) => store.monitoringActivities.openIssuesPartnership
);
