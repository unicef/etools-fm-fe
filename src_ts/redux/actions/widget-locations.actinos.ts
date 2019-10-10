export enum WidgetLocationsActionTypes {
    SAVE_WIDGET_LOCATIONS_LIST = '[Widget Locations Action]: SAVE_WIDGET_LOCATIONS_LIST',
    SAVE_LOCATION_PATH = '[Widget Locations Action]: SAVE_LOCATION_PATH',
    SET_WIDGET_LOCATIONS_LOADING = '[Widget Locations Action]: SET_WIDGET_LOCATIONS_LOADING',
    SET_LOCATION_PATH_LOADING = '[Widget Locations Action]: SET_LOCATION_PATH_LOADING'
}

export class SaveWidgetLocations {
    public readonly type: WidgetLocationsActionTypes.SAVE_WIDGET_LOCATIONS_LIST =
        WidgetLocationsActionTypes.SAVE_WIDGET_LOCATIONS_LIST;
    public constructor(public widgetLocations: WidgetLocation[], public requestParams: string) {}
}

export class SaveLocationPath {
    public readonly type: WidgetLocationsActionTypes.SAVE_LOCATION_PATH = WidgetLocationsActionTypes.SAVE_LOCATION_PATH;
    public constructor(public locationPath: WidgetLocation[], public locationId: string) {}
}

export class SetWidgetLocationsLoading {
    public readonly type: WidgetLocationsActionTypes.SET_WIDGET_LOCATIONS_LOADING =
        WidgetLocationsActionTypes.SET_WIDGET_LOCATIONS_LOADING;
    public constructor(public payload: boolean | null) {}
}

export class SetLocationPathLoading {
    public readonly type: WidgetLocationsActionTypes.SET_LOCATION_PATH_LOADING =
        WidgetLocationsActionTypes.SET_LOCATION_PATH_LOADING;
    public constructor(public payload: boolean | null) {}
}

export type WidgetLocationsActions = SaveWidgetLocations | SetWidgetLocationsLoading |
    SetLocationPathLoading | SaveLocationPath;
