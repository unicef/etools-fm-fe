import {select} from './create-selectors';

export const globalLoadingSelector: Selector<string | null> = select<string | null>(
  (store: IRootState) => store.globalLoading.message
);
