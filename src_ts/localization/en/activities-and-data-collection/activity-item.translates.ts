import {
  ASSIGNED,
  CHECKLIST,
  COMPLETED,
  DATA_COLLECTION,
  DRAFT,
  REPORT_FINALIZATION,
  REVIEW,
  SUBMITTED,
  MARK_DETAILS_CONFIGURED,
  MARK_CHECKLIST_CONFIGURED,
  ASSIGN,
  ACCEPT,
  REJECT,
  MARK_DATA_COLLECTED,
  SUBMIT_REPORT,
  COMPLETE,
  CANCEL
} from '../../../components/pages/activities-and-data-collection/activity-item/statuses-actions/activity-statuses';
import {
  ADDITIONAL_INFO,
  ATTACHMENTS_TAB,
  CHECKLIST_TAB,
  COLLECT_TAB,
  DETAILS_TAB,
  REVIEW_TAB
} from '../../../components/pages/activities-and-data-collection/activity-item/activities-tabs';

export const ACTIVITY_ITEM_TRANSLATES: TranslateObject = {
  ACTIVITY_ITEM: {
    NEW_ACTIVITY: 'New Activity',
    STATUS_CHANGE: 'Changing Status',
    TRANSITIONS: {
      [MARK_DETAILS_CONFIGURED]: 'Next',
      [MARK_CHECKLIST_CONFIGURED]: 'Review',
      ASSIGN_AND_ACCEPT: 'Assign & Accept',
      [ASSIGN]: 'Assign',
      [ACCEPT]: 'Accept',
      [MARK_DATA_COLLECTED]: 'Finalize',
      [SUBMIT_REPORT]: 'Submit',
      [COMPLETE]: 'Complete',
      [REJECT]: 'Reject',
      [CANCEL]: 'Cancel'
    },
    REASON_FOR_TRANSITION: {
      [CANCEL]: {LABEL: 'Cancellation comment', TITLE: 'Cancellation reason'},
      [REJECT]: {LABEL: 'Rejection comment', TITLE: 'Rejection reason'}
    },
    STATUSES: {
      [DRAFT]: 'Draft',
      [CHECKLIST]: 'Checklist',
      [REVIEW]: 'Review',
      [ASSIGNED]: 'Assigned',
      [DATA_COLLECTION]: 'Data Collection',
      [REPORT_FINALIZATION]: 'Report finalization',
      [SUBMITTED]: 'Submitted',
      [COMPLETED]: 'Completed'
    },
    TABS: {
      [DETAILS_TAB]: 'Details',
      [ATTACHMENTS_TAB]: 'Attachments',
      [CHECKLIST_TAB]: 'Checklist',
      [REVIEW_TAB]: 'Review',
      [COLLECT_TAB]: 'Data Collect',
      [ADDITIONAL_INFO]: 'Additional Info'
    }
  }
};
