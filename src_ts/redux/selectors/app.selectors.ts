import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/src/interfaces/router.interfaces';
import {select} from './create-selectors';

export const routeDetailsSelector: Selector<EtoolsRouteDetails> = select<EtoolsRouteDetails>(
  (store: IRootState) => store.app.routeDetails
);
