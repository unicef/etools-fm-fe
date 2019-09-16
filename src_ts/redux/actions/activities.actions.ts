export enum ActivitiesActionTypes {
    SET_ACTIVITIES_LIST = '[Activities Action]: SET_ACTIVITIES_LIST'
}

export class SetActivitiesList {
    public readonly type: ActivitiesActionTypes.SET_ACTIVITIES_LIST =
        ActivitiesActionTypes.SET_ACTIVITIES_LIST;
    public constructor(public payload: IListData<IListActivity>) {}
}

export type ActivitiesActions = SetActivitiesList;
