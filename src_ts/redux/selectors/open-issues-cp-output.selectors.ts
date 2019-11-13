import {select} from './create-selectors';

export const openIssuesCpOutputSelector: Selector<OpenIssuesActionPoints[]> = select<OpenIssuesActionPoints[]>(
  (store: IRootState) => store.monitoringActivities.openIssuesCpOutput
);
