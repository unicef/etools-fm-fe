import {select} from './create-selectors';

export const interventionsCoverageSelector: Selector<InterventionsCoverage[]> = select<InterventionsCoverage[]>(
  (store: IRootState) => store.monitoringActivities.interventionsCoverage
);
