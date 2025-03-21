export enum StaticDataActionTypes {
  ADD_STATIC_DATA = '[Static Data Action]: ADD_STATIC_DATA',
  UPDATE_STATIC_DATA = '[Static Data Action]: UPDATE_STATIC_DATA',
  RESET_STATIC_DATA = '[Static Data Action]: RESET_STATIC_DATA'
}

export class AddStaticData<T> {
  readonly type: StaticDataActionTypes.ADD_STATIC_DATA = StaticDataActionTypes.ADD_STATIC_DATA;

  constructor(
    public dataName: keyof IStaticDataState,
    public payload: T[]
  ) {}
}

export class UpdateStaticData<T> {
  readonly type: StaticDataActionTypes.UPDATE_STATIC_DATA = StaticDataActionTypes.UPDATE_STATIC_DATA;

  constructor(
    public dataName: keyof IStaticDataState,
    public payload: T
  ) {}
}

export class ResetStaticData<T> {
  readonly type: StaticDataActionTypes.RESET_STATIC_DATA = StaticDataActionTypes.RESET_STATIC_DATA;

  constructor(
    public dataName: keyof IStaticDataState,
    public payload: T[] = []
  ) {}
}

export type StaticDataActions<T> = AddStaticData<T> | UpdateStaticData<T> | ResetStaticData<T>;
