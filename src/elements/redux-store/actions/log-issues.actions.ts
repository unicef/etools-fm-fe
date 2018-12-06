export const SET_LOG_ISSUES = 'SET_LOG_ISSUES';
export const START_REQUEST_LOG_ISSUES = 'START_REQUEST_LOG_ISSUES';
export const FINISH_REQUEST_LOG_ISSUES = 'FINISH_REQUEST_LOG_ISSUES';
export const SET_ERROR_LOG_ISSUES = 'SET_ERROR_LOG_ISSUES';

export class SetLogIssues {
    public readonly type = SET_LOG_ISSUES;
    public constructor(public payload: IListData<LogIssue>) { }
}

export class StartRequestLogIssues {
    public readonly type = START_REQUEST_LOG_ISSUES;
}

export class FinishRequestLogIssues {
    public readonly type = FINISH_REQUEST_LOG_ISSUES;
}

export class SetRequestErrorLogIssues {
    public readonly type = SET_ERROR_LOG_ISSUES;
    public constructor(public payload: {errors: any}) {}
}

export type LogIssuesActions = SetLogIssues | StartRequestLogIssues | FinishRequestLogIssues | SetRequestErrorLogIssues;
