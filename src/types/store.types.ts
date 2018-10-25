type FMStore = {
    userData: IUserProfile,
    staticData: StaticData,
    initialization: string,
    globalLoading: any[]
    notifications: any[]
};

type StaticData = {
    [dataName: string]: any[]
};

type StoreSelectorFunction = (store: FMStore) => any;
type StoreSelector = string | StoreSelectorFunction;