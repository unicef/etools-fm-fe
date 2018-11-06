export const SET_METHOD_TYPES_LIST = 'SET_METHODS_LIST';

export class SetMethodTypesList {
    public readonly type = SET_METHOD_TYPES_LIST;
    public constructor(public payload: IStatedListData<MethodType>) {}
}
