import { select } from './create-selectors';

// TODO: add FullReport interface here!
export const fullReportSelector: Selector<any | null> =
    select<any | null>((store: IRootState) => store.fullReport);
