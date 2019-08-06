interface IRootState {
    app: IAppState;
    user: IUserState;
}

type StoreSelectorFunction<T> = (store: IRootState) => T;
