type FMStore = {
    userData: IUserProfile;
    staticData: StaticData;
    initialization: string;
    globalLoading: LoadingData[];
    notifications: Toast[];
    methods: IStatedListData<Method>;
    currentWorkspace: Workspace;
    specificLocations: IStatedListData<Site>;
    widgetLocationsStore: WidgetLocationsStore;
};

type StaticData = {
    [dataName: string]: any[]
};

type WidgetLocationsStore = {
    loading: boolean;
    data: WidgetStoreData
};

type WidgetStoreData = {
    [query: string]: WidgetLocation[];
};

type StoreSelectorFunction = (store: FMStore) => any;
type StoreSelector = string | StoreSelectorFunction;
