import {select} from './create-selectors';

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
