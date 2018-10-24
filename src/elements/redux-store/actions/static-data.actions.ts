export const ADD_STATIC_DATA = 'ADD_STATIC_DATA';
export const UPDATE_STATIC_DATA = 'UPDATE_STATIC_DATA';
export const RESET_STATIC_DATA = 'RESET_STATIC_DATA';

export class AddStaticData<T> {
    public readonly type = ADD_STATIC_DATA;
    public constructor(
        public dataName: string,
        public payload: T[]
    ) { }
}

export class UpdateStaticData<T> {
    public readonly type = UPDATE_STATIC_DATA;
    public constructor(
        public dataName: string,
        public payload: T
    ) { }
}

export class ResetStaticData<T> {
    public readonly type = RESET_STATIC_DATA;
    public constructor(
        public dataName: string,
        public payload: T[] = []
    ) { }
}

export type StaticDataActions<T> = AddStaticData<T> | UpdateStaticData<T> | ResetStaticData<T>;
