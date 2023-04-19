import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {select} from './create-selectors';

export const routeDetailsSelector: Selector<EtoolsRouteDetails> = select<EtoolsRouteDetails>(
  (store: IRootState) => store.app.routeDetails
);
