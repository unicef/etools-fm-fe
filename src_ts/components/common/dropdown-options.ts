import {
  ASSIGNED,
  CANCELLED,
  CHECKLIST,
  COMPLETED,
  DATA_COLLECTION,
  DRAFT,
  REPORT_FINALIZATION,
  REVIEW,
  SUBMITTED
} from '../pages/activities-and-data-collection/activity-item/statuses-actions/activity-statuses';

// ANSWER_TYPES
export const FILE_TYPE: 'file' = 'file';
export const TEXT_TYPE: 'text' = 'text';
export const NUMBER_TYPE: 'number' = 'number';
export const BOOL_TYPE: 'bool' = 'bool';
export const SCALE_TYPE: 'likert_scale' = 'likert_scale';

// Data collection Json specific types
export const NUMBER_INTEGER_TYPE: 'number-integer' = 'number-integer';
export const NUMBER_FLOAT_TYPE: 'number-float' = 'number-float';

// LEVELS
export const PARTNER: 'partner' = 'partner';
export const OUTPUT: 'output' = 'output';
export const INTERVENTION: 'intervention' = 'intervention';

// MONITOR_TYPES
export const STAFF: 'staff' = 'staff';
export const TPM: 'tpm' = 'tpm';

export const ANSWER_TYPES: AnswerTypeOption[] = [
  {value: TEXT_TYPE, display_name: `ANSWER_TYPE_OPTIONS.TEXT`},
  {value: NUMBER_INTEGER_TYPE, display_name: `ANSWER_TYPE_OPTIONS.NUMBER_INTEGER_TYPE`},
  {value: NUMBER_FLOAT_TYPE, display_name: `ANSWER_TYPE_OPTIONS.NUMBER_FLOAT_TYPE`},
  {value: BOOL_TYPE, display_name: `ANSWER_TYPE_OPTIONS.BOOL`},
  {value: SCALE_TYPE, display_name: `ANSWER_TYPE_OPTIONS.LIKERT_SCALE`}
];

export const LEVELS: DefaultDropdownOption<string>[] = [
  {value: PARTNER, display_name: `LEVELS_OPTIONS.PARTNER`},
  {value: OUTPUT, display_name: `LEVELS_OPTIONS.OUTPUT`},
  {value: INTERVENTION, display_name: `LEVELS_OPTIONS.INTERVENTION`}
];

export const MONITOR_TYPES: DefaultDropdownOption<string>[] = [
  {value: STAFF, display_name: `MONITOR_TYPES.STAFF`},
  {value: TPM, display_name: `MONITOR_TYPES.TPM`}
];

export const ACTIVITY_STATUSES: DefaultDropdownOption<string>[] = [
  {value: DRAFT, display_name: `ACTIVITY_STATUSES.DRAFT`},
  {value: CHECKLIST, display_name: `ACTIVITY_STATUSES.CHECKLIST`},
  {value: REVIEW, display_name: `ACTIVITY_STATUSES.REVIEW`},
  {value: ASSIGNED, display_name: `ACTIVITY_STATUSES.ASSIGNED`},
  {value: DATA_COLLECTION, display_name: `ACTIVITY_STATUSES.DATA_COLLECTION`},
  {value: REPORT_FINALIZATION, display_name: `ACTIVITY_STATUSES.REPORT_FINALIZATION`},
  {value: SUBMITTED, display_name: `ACTIVITY_STATUSES.SUBMITTED`},
  {value: COMPLETED, display_name: `ACTIVITY_STATUSES.COMPLETED`},
  {value: CANCELLED, display_name: `ACTIVITY_STATUSES.CANCELLED`}
];

export const STATUS_OPTIONS: SiteStatusOption[] = [
  {id: 0, value: false, display_name: 'SITES.STATUS.INACTIVE'},
  {id: 1, value: true, display_name: 'SITES.STATUS.ACTIVE'}
];
