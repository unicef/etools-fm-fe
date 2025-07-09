import {select} from './create-selectors';

export const widgetLocationsItems: Selector<WidgetLocation[]> = select<WidgetLocation[]>(
  (store: IRootState) => store.widgetLocations.items
);

export const widgetLocationsLoading: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.widgetLocations.loading
);

export const widgetLocationPathLoading: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.widgetLocations.pathLoading
);
