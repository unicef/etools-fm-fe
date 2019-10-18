import { translate } from '../../localization/localisation';
import {
    ASSIGNED,
    CANCELLED,
    CHECKLIST, COMPLETED, DATA_COLLECTION, DRAFT, REPORT_FINALIZATION, REVIEW, SUBMITTED
} from '../pages/activities-and-data-collection/activity-item/statuses-actions/activity-statuses';

// ANSWER_TYPES
export const TEXT_TYPE: 'text' = 'text';
export const NUMBER_TYPE: 'number' = 'number';
export const BOOLEAN_TYPE: 'bool' = 'bool';
export const SCALE_TYPE: 'likert_scale' = 'likert_scale';

// LEVELS
export const PARTNER: 'partner' = 'partner';
export const OUTPUT: 'output' = 'output';
export const INTERVENTION: 'intervention' = 'intervention';

// ACTIVITY_TYPES
export const STAFF: 'staff' = 'staff';
export const TPM: 'tpm' = 'tpm';

export const ANSWER_TYPES: AnswerTypeOption[] = [
    { value: TEXT_TYPE, display_name: translate(`ANSWER_TYPE_OPTIONS.TEXT`) },
    { value: NUMBER_TYPE, display_name: translate(`ANSWER_TYPE_OPTIONS.NUMBER`) },
    { value: BOOLEAN_TYPE, display_name: translate(`ANSWER_TYPE_OPTIONS.BOOL`) },
    { value: SCALE_TYPE, display_name: translate(`ANSWER_TYPE_OPTIONS.LIKERT_SCALE`) }
];

export const LEVELS: DefaultDropdownOption<string>[] = [
    { value: PARTNER, display_name: translate(`LEVELS_OPTIONS.PARTNER`) },
    { value: OUTPUT, display_name: translate(`LEVELS_OPTIONS.OUTPUT`) },
    { value: INTERVENTION, display_name: translate(`LEVELS_OPTIONS.INTERVENTION`) }
];

export const ACTIVITY_TYPES: DefaultDropdownOption<string>[] = [
    { value: STAFF, display_name: translate(`ACTIVITY_TYPES.STAFF`) },
    { value: TPM, display_name: translate(`ACTIVITY_TYPES.TPM`) }
];

export const ACTIVITY_STATUSES: DefaultDropdownOption<string>[] = [
    { value: DRAFT, display_name: translate(`ACTIVITY_STATUSES.DRAFT`) },
    { value: CHECKLIST, display_name: translate(`ACTIVITY_STATUSES.CHECKLIST`) },
    { value: REVIEW, display_name: translate(`ACTIVITY_STATUSES.REVIEW`) },
    { value: ASSIGNED, display_name: translate(`ACTIVITY_STATUSES.ASSIGNED`) },
    { value: DATA_COLLECTION, display_name: translate(`ACTIVITY_STATUSES.DATA_COLLECTION`) },
    { value: REPORT_FINALIZATION, display_name: translate(`ACTIVITY_STATUSES.REPORT_FINALIZATION`) },
    { value: SUBMITTED, display_name: translate(`ACTIVITY_STATUSES.SUBMITTED`) },
    { value: COMPLETED, display_name: translate(`ACTIVITY_STATUSES.COMPLETED`) },
    { value: CANCELLED, display_name: translate(`ACTIVITY_STATUSES.CANCELLED`) }
];
