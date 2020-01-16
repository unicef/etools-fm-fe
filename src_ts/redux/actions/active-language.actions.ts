export enum ActiveLanguageActionTypes {
  ACTIVE_LANGUAGE_SWITCHED = '[LANGUAGE SWITCH] ACTIVE_LANGUAGE_SWITCHED'
}

export class ActiveLanguageSwitched {
  readonly type: ActiveLanguageActionTypes.ACTIVE_LANGUAGE_SWITCHED =
    ActiveLanguageActionTypes.ACTIVE_LANGUAGE_SWITCHED;
  constructor(public payload: string) {}
}

export type ActiveLanguageTypes = ActiveLanguageSwitched;
