export enum SitesActionsTypes {
    SET_SPECIFIC_LOCATIONS_LIST = '[Sites Action]: SET_SPECIFIC_LOCATIONS_LIST',
    START_SITE_LOCATIONS_UPDATING = '[Sites Action]:START_SITE_LOCATIONS_UPDATING',
    STOP_SITE_LOCATIONS_UPDATING = '[Sites Action]:STOP_SITE_LOCATIONS_UPDATING',
    SET_SITE_LOCATIONS_UPDATING_ERROR = '[Sites Action]:SET_SITE_LOCATIONS_UPDATING_ERROR'
}
export class SetSpecificLocatinos {
    public readonly type: SitesActionsTypes.SET_SPECIFIC_LOCATIONS_LIST = SitesActionsTypes.SET_SPECIFIC_LOCATIONS_LIST;
    public constructor(public payload: IStatedListData<Site>) {}
}
export class StartSiteLocationsUpdating {
    public readonly type: SitesActionsTypes.START_SITE_LOCATIONS_UPDATING =
        SitesActionsTypes.START_SITE_LOCATIONS_UPDATING;
}

export class StopSiteLocationsUpdating {
    public readonly type: SitesActionsTypes.STOP_SITE_LOCATIONS_UPDATING =
        SitesActionsTypes.STOP_SITE_LOCATIONS_UPDATING;
}

export class SetSiteLocationsUpdatingError {
    public readonly type: SitesActionsTypes.SET_SITE_LOCATIONS_UPDATING_ERROR =
        SitesActionsTypes.SET_SITE_LOCATIONS_UPDATING_ERROR;
    public constructor(public payload: {errors: any}) {}
}

export type SiteLocationsActions = SetSpecificLocatinos | StartSiteLocationsUpdating |
    StopSiteLocationsUpdating | SetSiteLocationsUpdatingError;
