import { select } from './create-selectors';

export const cpOutputCoverageSelector: Selector<CpOutputCoverage[]> = select<CpOutputCoverage[]>((store: IRootState) => store.monitoringActivities.cpOutputCoverage);
