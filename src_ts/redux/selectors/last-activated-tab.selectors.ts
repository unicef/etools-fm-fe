import {select} from './create-selectors';

export const lastActivatedTabSelector: Selector<string> = select<string>(
  (store: IRootState) => store.monitoringActivities.lastActivatedTab
);
