import { EtoolsRouteQueryParams } from "@unicef-polymer/etools-utils/dist/interfaces/router.interfaces";

export enum AppActionTypes {
  UPDATE_ROUTE_DETAILS = '[App Actions]: UPDATE_ROUTE_DETAILS',
  UPDATE_QUERY_PARAMS = '[App Actions]: UPDATE_QUERY_PARAMS',
  UPDATE_DRAWER_STATE = '[App Actions]: UPDATE_DRAWER_STATE',
  SAVE_ROUTE = '[App Actions]: SAVE_ROUTE'
}

export class UpdateStoreRouteDetails {
  readonly type: AppActionTypes.UPDATE_ROUTE_DETAILS = AppActionTypes.UPDATE_ROUTE_DETAILS;

  constructor(public routeDetails: any) {}
}

export class UpdateQueryParams {
  readonly type: AppActionTypes.UPDATE_QUERY_PARAMS = AppActionTypes.UPDATE_QUERY_PARAMS;

  constructor(public queryParams: EtoolsRouteQueryParams | null = null) {}
}

export class UpdateDrawerState {
  readonly type: AppActionTypes.UPDATE_DRAWER_STATE = AppActionTypes.UPDATE_DRAWER_STATE;

  constructor(public opened: boolean) {}
}

export class SaveRoute {
  readonly type: AppActionTypes.SAVE_ROUTE = AppActionTypes.SAVE_ROUTE;
  constructor(public previousRoute: string | null) {}
}

export type AppAction = UpdateStoreRouteDetails | UpdateDrawerState | UpdateQueryParams | SaveRoute;
