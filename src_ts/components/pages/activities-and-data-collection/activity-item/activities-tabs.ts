export const DETAILS_TAB = 'details';
export const ATTACHMENTS_TAB = 'attachments';
export const CHECKLIST_TAB = 'checklist';
export const REVIEW_TAB = 'review';
export const COLLECT_TAB = 'collect';
export const SUMMARY_TAB = 'summary';
export const ADDITIONAL_INFO = 'additional-info';
export const ACTION_POINTS = 'action-points';

export const TABS_PROPERTIES: GenericObject<string> = {
  [CHECKLIST_TAB]: 'activity_question_set',
  [REVIEW_TAB]: 'activity_question_set_review',
  [COLLECT_TAB]: 'started_checklist_set',
  [ADDITIONAL_INFO]: 'additional_info',
  [SUMMARY_TAB]: 'activity_overall_finding',
  [ACTION_POINTS]: 'action_points'
};
