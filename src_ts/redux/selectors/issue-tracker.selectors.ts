import { select } from './create-selectors';

export const issueTrackerData: Selector<IListData<LogIssue> | null> = select<IListData<LogIssue> | null>((store: IRootState) => store.issueTracker.data);
export const issueTrackerUpdate: Selector<boolean | null> = select<boolean | null>((store: IRootState) => store.issueTracker.isRequest.update);
