import { select } from './create-selectors';

export const activitiesListData: Selector<IListData<IListActivity> | null> =
    select<IListData<IListActivity> | null>((store: IRootState) => store.activities.listData);
