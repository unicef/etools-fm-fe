import {select} from './create-selectors';

export const actionPointsListSelector: Selector<ActionPoint[]> = select<ActionPoint[]>(
  (store: IRootState) => store.actionPointsList.data
);

export const actionPointsOfficesSelector: Selector<OfficeSectionType[]> = select<OfficeSectionType[]>(
  (store: IRootState) => store.actionPointsList.offices
);

export const actionPointsCategoriesSelector: Selector<ActionPointsCategory[]> = select<ActionPointsCategory[]>(
  (store: IRootState) => store.actionPointsList.categories
);

export const actionPointsUpdateSelector: Selector<boolean> = select<boolean>(
  (store: IRootState) => store.actionPointsList.isUpdateSuccessful
);
