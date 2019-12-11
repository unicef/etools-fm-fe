export const DETAILS_TAB: string = 'details';
export const ATTACHMENTS_TAB: string = 'attachments';
export const CHECKLIST_TAB: string = 'checklist';
export const REVIEW_TAB: string = 'review';
export const COLLECT_TAB: string = 'collect';
export const SUMMARY_TAB: string = 'summary';
export const ADDITIONAL_INFO: string = 'additional-info';
export const ACTION_POINTS: string = 'action-points';

export const TABS_PROPERTIES: GenericObject<string> = {
  [CHECKLIST_TAB]: 'activity_question_set',
  [REVIEW_TAB]: 'activity_question_set_review',
  [COLLECT_TAB]: 'started_checklist_set',
  [ADDITIONAL_INFO]: 'additional_info',
  [SUMMARY_TAB]: 'activity_overall_finding',
  [ACTION_POINTS]: 'action_points'
};
