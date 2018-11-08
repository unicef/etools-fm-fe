export const SET_SPECIFIC_LOCATIONS_LIST = 'SET_SPECIFIC_LOCATIONS_LIST';

export class SetSpecificLocatinos {
    public readonly type = SET_SPECIFIC_LOCATIONS_LIST;
    public constructor(public payload: IStatedListData<Site>) {}
}
