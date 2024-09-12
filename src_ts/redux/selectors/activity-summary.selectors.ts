import {select} from './create-selectors';

export const summaryFindingsAndOverallData: Selector<FindingsAndOverall> = select<FindingsAndOverall>(
  (store: IRootState) => store.activitySummary.findingsAndOverall
);

export const summaryFindingsOverall: Selector<SummaryOverall[] | null> = select<SummaryOverall[] | null>(
  (store: IRootState) => store.activitySummary?.findingsAndOverall?.overall
);
