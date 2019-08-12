import { select } from './create-selectors';

export const locationsDataSelector: Selector<any[] | undefined> = select<any[] | undefined>((store: IRootState) => store.staticData.locations);
