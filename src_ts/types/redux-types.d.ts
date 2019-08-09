interface IRootState {
    app: IAppState;
    user: IUserState;
    staticData: IStaticDataState;
}

type StoreSelectorFunction<T> = (store: IRootState) => T;

interface IAppState {
    routeDetails: IRouteDetails;
    drawerOpened: boolean;
}

interface IUserState {
    data: IEtoolsUserModel | null;
    permissions: GenericObject | null;
}

interface IStaticDataState {
    locations?: any[];
}

type Selector<T> = (onChange: (state: T) => void) => Callback;

type AsyncEffect = any;
