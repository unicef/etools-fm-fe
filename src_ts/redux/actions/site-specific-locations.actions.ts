export enum SitesActionsTypes {
  START_SITE_LOCATIONS_UPDATING = '[Sites Action]:START_SITE_LOCATIONS_UPDATING',
  STOP_SITE_LOCATIONS_UPDATING = '[Sites Action]:STOP_SITE_LOCATIONS_UPDATING',
  SET_SITE_LOCATIONS_UPDATING_ERROR = '[Sites Action]:SET_SITE_LOCATIONS_UPDATING_ERROR'
}

export class StartSiteLocationsUpdating {
  readonly type: SitesActionsTypes.START_SITE_LOCATIONS_UPDATING = SitesActionsTypes.START_SITE_LOCATIONS_UPDATING;
}

export class StopSiteLocationsUpdating {
  readonly type: SitesActionsTypes.STOP_SITE_LOCATIONS_UPDATING = SitesActionsTypes.STOP_SITE_LOCATIONS_UPDATING;
}

export class SetSiteLocationsUpdatingError {
  readonly type: SitesActionsTypes.SET_SITE_LOCATIONS_UPDATING_ERROR =
    SitesActionsTypes.SET_SITE_LOCATIONS_UPDATING_ERROR;

  constructor(public payload: {errors: any}) {}
}

export type SiteLocationsActions =
  | StartSiteLocationsUpdating
  | StopSiteLocationsUpdating
  | SetSiteLocationsUpdatingError;
