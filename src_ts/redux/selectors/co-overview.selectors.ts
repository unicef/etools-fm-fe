import {select} from './create-selectors';

export const fullReportData: Selector<GenericObject<FullReportData>> = select<GenericObject<FullReportData>>(
  (store: IRootState) => store.fullReports.data
);

export const fullReportIsLoad: Selector<boolean> = select<boolean>(
  (store: IRootState) => store.fullReports.isRequest.load
);

export const fullReportError: Selector<GenericObject | null> = select<GenericObject | null>(
  (store: IRootState) => store.fullReports.error
);
