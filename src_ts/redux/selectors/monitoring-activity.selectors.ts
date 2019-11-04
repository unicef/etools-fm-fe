import { select } from './create-selectors';

export const monitoringActivitySelector: Selector<IMonitoringActivityState> = select<IMonitoringActivityState>((store: IRootState) => store.monitoringActivities);
