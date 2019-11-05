import { select } from './create-selectors';

export const partnersCoverageSelector: Selector<PartnersCoverage[]> = select<PartnersCoverage[]>((store: IRootState) => store.monitoringActivities.partnersCoverage);
