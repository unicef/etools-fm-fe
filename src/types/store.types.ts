type FMStore = {
    userData: IUserProfile,
    staticData: StaticData,
    initialization: string,
    globalLoading: any[]
    notifications: any[]
}

type StaticData = {
    [dataName: string]: any[]
}