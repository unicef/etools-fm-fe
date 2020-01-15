import {select} from './create-selectors';

export const routeDetailsSelector: Selector<IRouteDetails> = select<IRouteDetails>(
  (store: IRootState) => store.app.routeDetails
);
