export enum GlobalLoadingActionTypes {
  GLOBAL_LOADING_STATE_RETRIEVE = '[Global loading] GLOBAL_LOADING_STATE_RETRIEVE',
  GLOBAL_LOADING_STATE_UPDATE = '[Global loading] GLOBAL_LOADING_STATE_UPDATE'
}

export class GlobalLoadingRetrieve {
  readonly type: GlobalLoadingActionTypes.GLOBAL_LOADING_STATE_RETRIEVE =
    GlobalLoadingActionTypes.GLOBAL_LOADING_STATE_RETRIEVE;
}

export class GlobalLoadingUpdate {
  readonly type: GlobalLoadingActionTypes.GLOBAL_LOADING_STATE_UPDATE =
    GlobalLoadingActionTypes.GLOBAL_LOADING_STATE_UPDATE;
  constructor(public payload: string | null) {}
}
