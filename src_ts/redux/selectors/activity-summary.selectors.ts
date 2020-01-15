import {select} from './create-selectors';

export const summaryFindingsAndOverallData: Selector<FindingsAndOverall> = select<FindingsAndOverall>(
  (store: IRootState) => store.activitySummary.findingsAndOverall
);
