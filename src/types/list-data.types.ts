interface IListData<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

interface IStatedListData<T> extends IListData<T> {
    current: string;
}

type BaseListParams = {
    page?: string | number;
    page_size?: string | number;
};

type QueryParams = {
    [param: string]: number | string | boolean;
};
