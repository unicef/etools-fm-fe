export enum ActivitiesActionTypes {
  SET_ACTIVITIES_LIST = '[Activities Action]: SET_ACTIVITIES_LIST'
}

export class SetActivitiesList {
  readonly type: ActivitiesActionTypes.SET_ACTIVITIES_LIST = ActivitiesActionTypes.SET_ACTIVITIES_LIST;

  constructor(public payload: IListData<IListActivity>) {}
}

export type ActivitiesActions = SetActivitiesList;
