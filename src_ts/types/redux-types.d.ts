interface IRootState {
    app: IAppState;
    user: IUserState;
    country: IRequestState;
    staticData: IStaticDataState;
    specificLocations: ISpecificLocationsState;
    questions: IQuestionsState;
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
    currentWorkspace?: any;
    categories: EtoolsCategory[];
    sections: EtoolsSection[];
    methods: EtoolsMethod[];
}

interface ISpecificLocationsState {
    updateInProcess: null | boolean;
    errors: null | GenericObject;
    data: null | IStatedListData<Site>;
}

interface IQuestionsState {
    updateInProcess: null | boolean;
    error: null | GenericObject;
    data: null | IListData<Question>;
}

type Selector<T> = (onChange: (state: T) => void, initialize?: boolean) => Callback;

type AsyncEffect = any;
