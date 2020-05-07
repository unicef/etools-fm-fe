export enum ActionPointsActionTypes {
  SET_ACTION_POINTS_LIST = '[Action points action]: SET_ACTION_POINTS_LIST',
  UPDATE_ACTION_POINT = '[Action points action]: UPDATE_ACTION_POINT',
  GET_ACTION_POINTS_OFFICES = '[Action points action]: GET_ACTION_POINTS_OFFICES',
  GET_ACTION_POINTS_CATEGORIES = '[Action points action]: GET_ACTION_POINTS_CATEGORIES',
  UPDATE_ACTION_POINT_ERROR = '[Action points action]: UPDATE_ACTION_POINT_ERROR',
  SET_ACTION_POINTS_UPDATE_STATUS = '[Action points action]: SET_ACTION_POINTS_UPDATE_STATUS'
}

export class SetActionPointsList {
  readonly type: ActionPointsActionTypes.SET_ACTION_POINTS_LIST = ActionPointsActionTypes.SET_ACTION_POINTS_LIST;
  constructor(public payload: ActionPoint[]) {}
}

export class UpdateActionPoint {
  readonly type: ActionPointsActionTypes.UPDATE_ACTION_POINT = ActionPointsActionTypes.UPDATE_ACTION_POINT;
  constructor(public payload: any) {}
}

export class GetActionPointsOffices {
  readonly type: ActionPointsActionTypes.GET_ACTION_POINTS_OFFICES = ActionPointsActionTypes.GET_ACTION_POINTS_OFFICES;
  constructor(public payload: ActionPointsOffice[]) {}
}

export class GetActionPointsCategories {
  readonly type: ActionPointsActionTypes.GET_ACTION_POINTS_CATEGORIES =
    ActionPointsActionTypes.GET_ACTION_POINTS_CATEGORIES;
  constructor(public payload: ActionPointsCategory[]) {}
}

export class UpdateActionPointError {
  readonly type: ActionPointsActionTypes.UPDATE_ACTION_POINT_ERROR = ActionPointsActionTypes.UPDATE_ACTION_POINT_ERROR;
  constructor(public payload: GenericObject) {}
}

export class SetActionPointsUpdateStatus {
  readonly type: ActionPointsActionTypes.SET_ACTION_POINTS_UPDATE_STATUS =
    ActionPointsActionTypes.SET_ACTION_POINTS_UPDATE_STATUS;
  constructor(public payload: boolean) {}
}

export type ActionPointsActions =
  | SetActionPointsList
  | UpdateActionPoint
  | GetActionPointsOffices
  | GetActionPointsCategories
  | UpdateActionPointError
  | SetActionPointsUpdateStatus;
