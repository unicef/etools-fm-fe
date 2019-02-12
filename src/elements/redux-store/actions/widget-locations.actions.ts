export const SAVE_WIDGET_LOCATIONS_LIST = 'SAVE_WIDGET_LOCATIONS_LIST';
export const SAVE_LOCATION_PATH = 'SAVE_LOCATION_PATH';
export const START_WIDGET_LOCATIONS_LOADING = 'START_WIDGET_LOCATIONS_LOADING';
export const STOP_WIDGET_LOCATIONS_LOADING = 'STOP_WIDGET_LOCATIONS_LOADING';
export const START_LOCATION_PATH_LOADING = 'START_LOCATION_PATH_LOADING';
export const STOP_LOCATION_PATH_LOADING = 'STOP_LOCATION_PATH_LOADING';

export class SaveWidgetLocations {
    public readonly type = SAVE_WIDGET_LOCATIONS_LIST;
    public constructor(public widgetLocations: WidgetLocation[], public requestParams: string) {}
}

export class SaveLocationPath {
    public readonly type = SAVE_LOCATION_PATH;
    public constructor(public locationPath: WidgetLocation[], public locationId: string) {}
}

export class StartWidgetLocationsLoading {
    public readonly type = START_WIDGET_LOCATIONS_LOADING;
}

export class StopWidgetLocationsLoading {
    public readonly type = STOP_WIDGET_LOCATIONS_LOADING;
}

export class StopLocationPathLoading {
    public readonly type = STOP_LOCATION_PATH_LOADING;
}

export class StartLocationPathLoading {
    public readonly type = START_LOCATION_PATH_LOADING;
}

export type WidgetLocationsActions = SaveWidgetLocations | StartWidgetLocationsLoading | StopWidgetLocationsLoading |
    StartLocationPathLoading | StopLocationPathLoading | SaveLocationPath;
