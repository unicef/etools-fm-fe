export const DRAFT: 'draft' = 'draft';
export const CHECKLIST: 'checklist' = 'checklist';
export const REVIEW: 'review' = 'review';
export const ASSIGNED: 'assigned' = 'assigned';
export const DATA_COLLECTION: 'data_collection' = 'data_collection';
export const REPORT_FINALIZATION: 'report_finalization' = 'report_finalization';
export const SUBMITTED: 'submitted' = 'submitted';
export const COMPLETED: 'completed' = 'completed';
export const CANCELLED: 'cancelled' = 'cancelled';

export const MARK_DETAILS_CONFIGURED: 'mark_details_configured' = 'mark_details_configured';
export const BACK_TO_DRAFT: 'revert_details_configured' = 'revert_details_configured';
export const MARK_CHECKLIST_CONFIGURED: 'mark_checklist_configured' = 'mark_checklist_configured';
export const BACK_TO_CHECKLIST: 'revert_checklist_configured' = 'revert_checklist_configured';
export const ASSIGN: 'assign' = 'assign';
export const ACCEPT: 'accept' = 'accept';
export const REJECT: 'reject' = 'reject';
export const MARK_DATA_COLLECTED: 'mark_data_collected' = 'mark_data_collected';
export const REVERT_DATA_COLLECTED: 'revert_data_collected' = 'revert_data_collected';
export const SUBMIT_REPORT: 'submit_report' = 'submit_report';
export const COMPLETE: 'complete' = 'complete';
export const CANCEL: 'cancel' = 'cancel';
export const REJECT_REPORT: 'reject_report' = 'reject_report';

export const BACK_TRANSITIONS: Set<string> = new Set([BACK_TO_DRAFT, BACK_TO_CHECKLIST, REVERT_DATA_COLLECTED]);
export const SEPARATE_TRANSITIONS: Set<string> = new Set([REJECT, REJECT_REPORT, ...Array.from(BACK_TRANSITIONS)]);

export const TRANSITIONS_ORDER: string[] = [
  MARK_DETAILS_CONFIGURED,
  BACK_TO_DRAFT,
  MARK_CHECKLIST_CONFIGURED,
  BACK_TO_CHECKLIST,
  ASSIGN,
  ACCEPT,
  REJECT,
  MARK_DATA_COLLECTED,
  REVERT_DATA_COLLECTED,
  SUBMIT_REPORT,
  COMPLETE,
  CANCEL,
  REJECT_REPORT
];

export const REASON_FIELDS: GenericObject<keyof IActivityDetails> = {
  [REJECT]: 'reject_reason',
  [CANCEL]: 'cancel_reason',
  [REJECT_REPORT]: 'report_reject_reason'
};
