export enum CountryActionTypes {
    START_CHANGE_COUNTRY = '[Country Action]: START_CHANGE_COUNTRY',
    FINISH_CHANGE_COUNTRY = '[Country Action]: FINISH_CHANGE_COUNTRY',
    ERROR_CHANGE_COUNTRY = '[Country Action]: ERROR_CHANGE_COUNTRY',
    CHANGE_COUNTRY = '[Country Action]: CHANGE_COUNTRY'
}

export class StartChangeCountry {
    public readonly type: CountryActionTypes.START_CHANGE_COUNTRY = CountryActionTypes.START_CHANGE_COUNTRY;
}

export class FinishChangeCountry {
    public readonly type: CountryActionTypes.FINISH_CHANGE_COUNTRY = CountryActionTypes.FINISH_CHANGE_COUNTRY;
}

export class ErrorChangeCountry {
    public readonly type: CountryActionTypes.ERROR_CHANGE_COUNTRY = CountryActionTypes.ERROR_CHANGE_COUNTRY;
    public constructor(public error: GenericObject) {}
}

export class ChangeCountry {
    public readonly type: CountryActionTypes.CHANGE_COUNTRY = CountryActionTypes.CHANGE_COUNTRY;
    public constructor(public countryId: number) {}
}

export type CountryAction = StartChangeCountry | FinishChangeCountry | ErrorChangeCountry | ChangeCountry;
