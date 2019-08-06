interface IRootState {
    app: IAppState;
    user: IUserState;
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

type Selector<T> = (onChange: (state: T) => void) => Callback;

type AsyncEffect = any;
