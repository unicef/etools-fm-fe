interface IRootState {
    app: IAppState;
    user: IUserState;
    country: IRequestState;
    staticData: IStaticDataState;
}

type StoreSelectorFunction<T> = (store: IRootState) => T;

interface IAppState {
    routeDetails: IRouteDetails;
    drawerOpened: boolean;
}

interface IRequestState {
    isRequest: boolean;
    error: GenericObject | null;
}

interface IUserState extends IRequestState {
    data: IEtoolsUserModel | null;
    permissions: GenericObject | null;
}

interface IStaticDataState {
    locations?: any[];
}

type Selector<T> = (onChange: (state: T) => void) => Callback;

type AsyncEffect = any;
