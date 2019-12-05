import {select} from './create-selectors';

export const editedFindingsTab: Selector<null | string> = select<null | string>(
  (store: IRootState) => store.findingsComponents.editedFindingsComponent
);

export const updateOverallAndFindingsState: Selector<null | boolean> = select<null | boolean>(
  (store: IRootState) => store.findingsComponents.overallAndFindingsUpdate
);
