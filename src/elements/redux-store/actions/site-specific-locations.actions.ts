export const SET_SPECIFIC_LOCATIONS_LIST = 'SET_SPECIFIC_LOCATIONS_LIST';
export const START_SITE_LOCATIONS_UPDATING = 'START_SITE_LOCATIONS_UPDATING';
export const STOP_SITE_LOCATIONS_UPDATING = 'STOP_SITE_LOCATIONS_UPDATING';
export const SET_SITE_LOCATIONS_UPDATING_ERROR = 'SET_SITE_LOCATIONS_UPDATING_ERROR';

export class SetSpecificLocatinos {
    public readonly type = SET_SPECIFIC_LOCATIONS_LIST;
    public constructor(public payload: IStatedListData<Site>) {}
}
export class StartSiteLocationsUpdating {
    public readonly type = START_SITE_LOCATIONS_UPDATING;
}

export class StopSiteLocationsUpdating {
    public readonly type = STOP_SITE_LOCATIONS_UPDATING;
}

export class SetSiteLocationsUpdatingError {
    public readonly type = SET_SITE_LOCATIONS_UPDATING_ERROR;
    public constructor(public payload: {errors: any}) {}
}

export type SiteLocationsActions = SetSpecificLocatinos | StartSiteLocationsUpdating |
    StopSiteLocationsUpdating | SetSiteLocationsUpdatingError;
