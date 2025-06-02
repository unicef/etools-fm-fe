export enum WidgetLocationsActionTypes {
  SET_WIDGET_LOCATIONS_LIST = '[Widget Locations Action]: SET_WIDGET_LOCATIONS_LIST',
  ADD_WIDGET_LOCATIONS_LIST = '[Widget Locations Action]: ADD_WIDGET_LOCATIONS_LIST',
  SAVE_LOCATION_PATH = '[Widget Locations Action]: SAVE_LOCATION_PATH',
  SET_WIDGET_LOCATIONS_LOADING = '[Widget Locations Action]: SET_WIDGET_LOCATIONS_LOADING',
  SET_LOCATION_PATH_LOADING = '[Widget Locations Action]: SET_LOCATION_PATH_LOADING'
}

export class AddWidgetLocations {
  readonly type: WidgetLocationsActionTypes.ADD_WIDGET_LOCATIONS_LIST =
    WidgetLocationsActionTypes.ADD_WIDGET_LOCATIONS_LIST;

  constructor(
    public widgetLocations: WidgetLocation[],
    public search: string = '',
    public query: string = ''
  ) {}
}

export class SetWidgetLocations {
  readonly type: WidgetLocationsActionTypes.SET_WIDGET_LOCATIONS_LIST =
    WidgetLocationsActionTypes.SET_WIDGET_LOCATIONS_LIST;

  constructor(
    public widgetLocations: WidgetLocation[],
    public search: string = '',
    public query: string = ''
  ) {}
}

export class SaveLocationPath {
  readonly type: WidgetLocationsActionTypes.SAVE_LOCATION_PATH = WidgetLocationsActionTypes.SAVE_LOCATION_PATH;

  constructor(
    public locationPath: WidgetLocation[],
    public locationId: string
  ) {}
}

export class SetWidgetLocationsLoading {
  readonly type: WidgetLocationsActionTypes.SET_WIDGET_LOCATIONS_LOADING =
    WidgetLocationsActionTypes.SET_WIDGET_LOCATIONS_LOADING;

  constructor(public payload: boolean | null) {}
}

export class SetLocationPathLoading {
  readonly type: WidgetLocationsActionTypes.SET_LOCATION_PATH_LOADING =
    WidgetLocationsActionTypes.SET_LOCATION_PATH_LOADING;

  constructor(public payload: boolean | null) {}
}

export type WidgetLocationsActions =
  | SetWidgetLocations
  | SetWidgetLocationsLoading
  | SetLocationPathLoading
  | SaveLocationPath
  | AddWidgetLocations;
