type FMStore = {
    userData: IUserProfile,
    staticData: StaticData,
    initialization: string,
    globalLoading: LoadingData[]
    notifications: Toast[]
    methods: Method[]
};

type StaticData = {
    [dataName: string]: any[]
};

type StoreSelectorFunction = (store: FMStore) => any;
type StoreSelector = string | StoreSelectorFunction;