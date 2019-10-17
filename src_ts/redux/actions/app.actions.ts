export enum AppActionTypes {
    UPDATE_ROUTE_DETAILS = '[App Actions]: UPDATE_ROUTE_DETAILS',
    UPDATE_QUERY_PARAMS = '[App Actions]: UPDATE_QUERY_PARAMS',
    UPDATE_DRAWER_STATE = '[App Actions]: UPDATE_DRAWER_STATE'
}

export class UpdateStoreRouteDetails {
    public readonly type: AppActionTypes.UPDATE_ROUTE_DETAILS = AppActionTypes.UPDATE_ROUTE_DETAILS;
    public constructor(public routeDetails: any) {}
}

export class UpdateQueryParams {
    public readonly type: AppActionTypes.UPDATE_QUERY_PARAMS = AppActionTypes.UPDATE_QUERY_PARAMS;
    public constructor(public queryParams: IRouteQueryParams | null = null) {}
}

export class UpdateDrawerState {
    public readonly type: AppActionTypes.UPDATE_DRAWER_STATE = AppActionTypes.UPDATE_DRAWER_STATE;
    public constructor(public opened: boolean) {}
}

export type AppAction = UpdateStoreRouteDetails | UpdateDrawerState | UpdateQueryParams;
