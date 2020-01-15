export enum AppActionTypes {
  UPDATE_ROUTE_DETAILS = '[App Actions]: UPDATE_ROUTE_DETAILS',
  UPDATE_QUERY_PARAMS = '[App Actions]: UPDATE_QUERY_PARAMS',
  UPDATE_DRAWER_STATE = '[App Actions]: UPDATE_DRAWER_STATE'
}

export class UpdateStoreRouteDetails {
  readonly type: AppActionTypes.UPDATE_ROUTE_DETAILS = AppActionTypes.UPDATE_ROUTE_DETAILS;

  constructor(public routeDetails: any) {}
}

export class UpdateQueryParams {
  readonly type: AppActionTypes.UPDATE_QUERY_PARAMS = AppActionTypes.UPDATE_QUERY_PARAMS;

  constructor(public queryParams: IRouteQueryParams | null = null) {}
}

export class UpdateDrawerState {
  readonly type: AppActionTypes.UPDATE_DRAWER_STATE = AppActionTypes.UPDATE_DRAWER_STATE;

  constructor(public opened: boolean) {}
}

export type AppAction = UpdateStoreRouteDetails | UpdateDrawerState | UpdateQueryParams;
