import {select} from './create-selectors';

export const fullReportSelector: Selector<FullReportData | null> = select<FullReportData | null>(
  (store: IRootState) => store.fullReport
);
