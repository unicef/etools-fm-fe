import {select} from './create-selectors';

export const organizationSelector: Selector<IRequestState> = select<IRequestState>(
  (store: IRootState) => store.organization
);
