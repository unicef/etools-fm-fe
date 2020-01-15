export enum ActivitySummaryActionTypes {
  FINDINGS_AND_OVERALL_GET_REQUEST = '[Activity Summary Action]: FINDINGS_AND_OVERALL_GET_REQUEST',
  FINDINGS_AND_OVERALL_GET_SUCCESS = '[Activity Summary Action]: FINDINGS_AND_OVERALL_GET_SUCCESS',
  FINDINGS_AND_OVERALL_GET_FAILURE = '[Activity Summary Action]: FINDINGS_AND_OVERALL_GET_FAILURE'
}

export type ActivitySummaryActions =
  | MiddlewareRequestAction<ActivitySummaryActionTypes.FINDINGS_AND_OVERALL_GET_REQUEST>
  | MiddlewareRequestAction<ActivitySummaryActionTypes.FINDINGS_AND_OVERALL_GET_SUCCESS>
  | MiddlewareRequestAction<ActivitySummaryActionTypes.FINDINGS_AND_OVERALL_GET_FAILURE>;
