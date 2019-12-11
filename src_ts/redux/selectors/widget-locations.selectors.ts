import {select} from './create-selectors';

export const widgetLocationsItems: Selector<WidgetLocation[]> = select<WidgetLocation[]>(
  (store: IRootState) => store.widgetLocations.items
);

export const widgetLocationsCount: Selector<number> = select<number>(
  (store: IRootState) => store.widgetLocations.count
);

export const widgetLocationsData: Selector<WidgetStoreData> = select<WidgetStoreData>(
  (store: IRootState) => store.widgetLocations.data
);
export const widgetLocationPathData: Selector<WidgetStoreData> = select<WidgetStoreData>(
  (store: IRootState) => store.widgetLocations.pathCollection
);
export const widgetLocationsLoading: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.widgetLocations.loading
);
export const widgetLocationPathLoading: Selector<boolean | null> = select<boolean | null>(
  (store: IRootState) => store.widgetLocations.pathLoading
);
