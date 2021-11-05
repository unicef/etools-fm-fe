/* eslint-disable */
interface IListData<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface IStatedListData<T> extends IListData<T> {
  current: string;
}

type QueryParams = {
  [param: string]: number | string | boolean | (string | number)[];
};
