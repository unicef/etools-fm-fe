import {select} from './create-selectors';

export const geoSectionsSelector: Selector<EtoolsSection[]> = select<EtoolsSection[]>(
  (store: IRootState) => store.monitoringActivities.sections
);
