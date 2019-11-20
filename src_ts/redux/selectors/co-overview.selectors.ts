import {select} from './create-selectors';

export const FullReportData: Selector<GenericObject<FullReportData>> = select<GenericObject<FullReportData>>(
  (store: IRootState) => store.fullReports.data
);

export const FullReportIsLoad: Selector<boolean> = select<boolean>(
  (store: IRootState) => store.fullReports.isRequest.load
);

export const FullReportError: Selector<GenericObject | null> = select<GenericObject | null>(
  (store: IRootState) => store.fullReports.error
);
