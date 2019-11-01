import { select } from './create-selectors';

export const analyzeSelector: Selector<IAnalyzeState> = select<IAnalyzeState>((store: IRootState) => store.analyzeActivities);
