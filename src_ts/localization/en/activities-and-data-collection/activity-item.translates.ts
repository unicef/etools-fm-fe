import {
    ASSIGNED,
    CHECKLIST, COMPLETED, DATA_COLLECTION,
    DRAFT, REPORT_FINALIZATION, REVIEW, SUBMITTED
} from '../../../components/pages/activities-and-data-collection/activity-item/statuses-actions/activity-statuses';

export const ACTIVITY_ITEM_TRANSLATES: TranslateObject = {
    'ACTIVITY_ITEM': {
        'NEW_ACTIVITY': 'New Activity',
        'ACTIVITY_DETAILS': 'Activity Details',
        'MONITOR_INFO': 'Monitor Information',
        'ENTRIES_TO_MONITOR': 'Entities to monitor',
        'USER_TYPE': 'Primary Field Monitor is',
        'USER_TYPES': {
            'STAFF': 'Staff',
            'TPM': 'Third Party Monitor'
        },
        'STATUS_CHANGE': 'Changing Status',
        'TRANSITIONS': {
            [`FROM_${ DRAFT }_TO_${ CHECKLIST }`]: 'Next',
            [`FROM_${ CHECKLIST }_TO_${ REVIEW }`]: 'Review',
            [`FROM_${ REVIEW }_TO_${ DATA_COLLECTION }`]: 'Assign & Accept',
            [`FROM_${ REVIEW }_TO_${ ASSIGNED }`]: 'Assign',
            [`FROM_${ ASSIGNED }_TO_${ DATA_COLLECTION }`]: 'Accept',
            [`FROM_${ DATA_COLLECTION }_TO_${ REPORT_FINALIZATION }`]: 'Finalize',
            [`FROM_${ REPORT_FINALIZATION }_TO_${ SUBMITTED }`]: 'Submit',
            [`FROM_${ SUBMITTED }_TO_${ COMPLETED }`]: 'Complete',
            'REJECT': 'Reject',
            'CANCEL': 'Cancel'
        }
    }
};
