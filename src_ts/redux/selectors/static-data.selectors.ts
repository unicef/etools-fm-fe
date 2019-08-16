import { select } from './create-selectors';

export const locationsDataSelector: Selector<any[] | undefined> = select<any[] | undefined>((store: IRootState) => store.staticData.locations);

export const currentWorkspaceSelector: Selector<Workspace | undefined> = select<Workspace | undefined>((store: IRootState) => store.staticData.currentWorkspace);
