import { select } from './create-selectors';

export const countrySelector: Selector<IRequestState> = select<IRequestState>((store: IRootState) => store.country);
