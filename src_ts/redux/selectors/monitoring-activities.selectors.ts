import {select} from './create-selectors';

export const cpOutputCoverageSelector: Selector<CpOutputCoverage[]> = select<CpOutputCoverage[]>(
  (store: IRootState) => store.monitoringActivities.cpOutputCoverage
);

export const geographicCoverageSelector: Selector<GeographicCoverage[]> = select<GeographicCoverage[]>(
  (store: IRootState) => store.monitoringActivities.geographicCoverage
);

export const hactVisitsSelector: Selector<HactVisits[]> = select<HactVisits[]>(
  (store: IRootState) => store.monitoringActivities.hactVisits
);

export const interventionsCoverageSelector: Selector<InterventionsCoverage[]> = select<InterventionsCoverage[]>(
  (store: IRootState) => store.monitoringActivities.interventionsCoverage
);

export const lastActivatedTabSelector: Selector<string> = select<string>(
  (store: IRootState) => store.monitoringActivities.lastActivatedTab
);

export const openIssuesCpOutputSelector: Selector<OpenIssuesActionPoints[]> = select<OpenIssuesActionPoints[]>(
  (store: IRootState) => store.monitoringActivities.openIssuesCpOutput
);

export const openIssuesLocationsSelector: Selector<OpenIssuesActionPoints[]> = select<OpenIssuesActionPoints[]>(
  (store: IRootState) => store.monitoringActivities.openIssuesLocation
);

export const openIssuesPartnershipSelector: Selector<OpenIssuesActionPoints[]> = select<OpenIssuesActionPoints[]>(
  (store: IRootState) => store.monitoringActivities.openIssuesPartnership
);

export const overallActivitiesSelector: Selector<OverallActivities> = select<OverallActivities>(
  (store: IRootState) => store.monitoringActivities.overallActivities
);

export const partnersCoverageSelector: Selector<PartnersCoverage[]> = select<PartnersCoverage[]>(
  (store: IRootState) => store.monitoringActivities.partnersCoverage
);
