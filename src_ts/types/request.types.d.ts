interface IEtoolsRequest {
  readonly lastAjaxRequest: object | null | undefined;
  readonly activeAjaxRequests: any[] | null | undefined;
  readonly reqProgress: object | null | undefined;
  checkReqProgress: object | null | undefined;

  sendRequest(reqConfig: any, activeReqKey?: any): any;

  getActiveRequestByKey(key: any): any;

  abortRequestByKey(key: any): void;

  abortActiveRequest(activeReqMapObj: any): void;
}

type DataComparisonOptions = {
  toRequest?: boolean;
  nestedFields?: string[];
  strongComparison?: boolean;
};
