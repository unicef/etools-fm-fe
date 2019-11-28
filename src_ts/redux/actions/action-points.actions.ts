export enum ActionPointsActionTypes {
  SET_ACTION_POINTS_LIST = '[Action points action]: SET_ACTION_POINTS_LIST',
  UPDATE_ACTION_POINT = '[Action points action]: UPDATE_ACTION_POINT',
  GET_ACTION_POINTS_OFFICES = '[Action points action]: GET_ACTION_POINTS_OFFICES',
  GET_ACTION_POINTS_CATEGORIES = '[Action points action]: GET_ACTION_POINTS_CATEGORIES',
  UPDATE_ACTION_POINT_ERROR = '[Action points action]: UPDATE_ACTION_POINT_ERROR',
  SET_ACTION_POINTS_UPDATE_STATE = '[Action points action]: SET_ACTION_POINTS_UPDATE_STATE'
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
  constructor(public payload: OfficeSectionType[]) {}
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

export class SetActionPointsUpdateState {
  readonly type: ActionPointsActionTypes.SET_ACTION_POINTS_UPDATE_STATE =
    ActionPointsActionTypes.SET_ACTION_POINTS_UPDATE_STATE;
  constructor(public payload: boolean) {}
}

export type ActionPointsActions =
  | SetActionPointsList
  | UpdateActionPoint
  | GetActionPointsOffices
  | GetActionPointsCategories
  | UpdateActionPointError
  | SetActionPointsUpdateState;
