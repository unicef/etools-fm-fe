interface IEtoolsRequest {
  readonly lastAjaxRequest: GenericObject | null | undefined;
  readonly activeAjaxRequests: any[] | null | undefined;
  readonly reqProgress: GenericObject | null | undefined;
  checkReqProgress: GenericObject | null | undefined;

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
