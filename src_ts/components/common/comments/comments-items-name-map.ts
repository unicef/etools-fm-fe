import {GenericObject} from '@unicef-polymer/etools-types';
import {
  DETAILS_TAB,
  ATTACHMENTS_TAB,
  CHECKLIST_TAB,
  REVIEW_TAB,
  COLLECT_TAB,
  SUMMARY_TAB,
  ADDITIONAL_INFO,
  ACTION_POINTS
} from '../../pages/activities-and-data-collection/activity-item/activities-tabs';

export const CommentsItemsNameMap: GenericObject<string> = {
  activity_details: 'ACTIVITY_DETAILS.ACTIVITY_DETAILS',
  entities_to_monitor: 'ACTIVITY_DETAILS.ENTRIES_TO_MONITOR',
  monitor_info: 'ACTIVITY_DETAILS.MONITOR_INFO',
  summary_partner: 'SUMMARY_PARTNER',
  summary_cp_output: 'SUMMARY_CPOUTPUT',
  summary_intervention: 'SUMMARY_PDSPD',
  collect: 'COLLECT',
  attachments_related: 'ATTACHMENTS_LIST.RELATED_DOCUMENTS',
  attachments_report: 'ATTACHMENTS_LIST.REPORT_ATTACHMENTS',
  attachments_checklist: 'ACTIVITY_ITEM.ACTIVITY_ATTACHMENTS.TITLE',
  additional_info_points_of_note: 'ACTIVITY_ADDITIONAL_INFO.ISSUE_TRACKER',
  additional_info_pd_spd_details: 'ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.TITLE',
  action_points: 'ACTIVITY_ITEM.ACTION_POINTS.TITLE',
  tpm_concerns: 'TPM_RAISED_ISSUES',
  checklist: 'ACTIVITY_ITEM.TABS.checklist',
  review: 'ACTIVITY_ITEM.TABS.review'
};

export const CommentsDescription: GenericObject<string> = {
  activity_details: 'ACTIVITY_DETAILS.ACTIVITY_DETAILS',
  entities_to_monitor: 'ACTIVITY_DETAILS.ENTRIES_TO_MONITOR',
  monitor_info: 'ACTIVITY_DETAILS.MONITOR_INFO',
  additional_info_points_of_note: 'ACTIVITY_ADDITIONAL_INFO.ISSUE_TRACKER',
  additional_info_pd_spd_details: 'ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.TITLE',
  action_points: 'ACTIVITY_ITEM.ACTION_POINTS.TITLE',
  tpm_concerns: 'TPM_RAISED_ISSUES'
};

export const ComponentsPosition: GenericObject<string> = {
  activity_details: DETAILS_TAB,
  entities_to_monitor: DETAILS_TAB,
  monitor_info: DETAILS_TAB,
  summary_partner: SUMMARY_TAB,
  summary_cp_output: SUMMARY_TAB,
  summary_intervention: SUMMARY_TAB,
  collect: COLLECT_TAB,
  checklist: CHECKLIST_TAB,
  attachments_related: ATTACHMENTS_TAB,
  attachments_report: ATTACHMENTS_TAB,
  attachments_checklist: ATTACHMENTS_TAB,
  additional_info_points_of_note: ADDITIONAL_INFO,
  additional_info_pd_spd_details: ADDITIONAL_INFO,
  action_points: ACTION_POINTS,
  tpm_concerns: ACTION_POINTS,
  review: REVIEW_TAB
};
