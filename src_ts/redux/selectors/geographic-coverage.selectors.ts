import {select} from './create-selectors';

export const geographicCoverageSelector: Selector<GeographicCoverage[]> = select<GeographicCoverage[]>(
  (store: IRootState) => store.monitoringActivities.geographicCoverage
);
