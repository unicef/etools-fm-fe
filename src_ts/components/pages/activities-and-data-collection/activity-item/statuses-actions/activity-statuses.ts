export const DRAFT: 'draft' = 'draft';
export const CHECKLIST: 'checklist' = 'checklist';
export const REVIEW: 'review' = 'review';
export const ASSIGNED: 'assigned' = 'assigned';
export const DATA_COLLECTION: 'data_collection' = 'data_collection';
export const REPORT_FINALIZATION: 'report_finalization' = 'report_finalization';
export const SUBMITTED: 'submitted' = 'submitted';
export const COMPLETED: 'completed' = 'completed';
export const CANCELLED: 'cancelled' = 'cancelled';

export const POSSIBLE_TRANSITIONS: GenericObject<ActivityTransition> = {
    [DRAFT]: {
        mainAction: CHECKLIST,
        cancelPossibility: true
    },
    [CHECKLIST]: {
        mainAction: REVIEW,
        backAction: DRAFT,
        cancelPossibility: true
    },
    [REVIEW]: {
        mainAction: { staff: DATA_COLLECTION, tpm: ASSIGNED },
        backAction: CHECKLIST,
        cancelPossibility: true
    },
    [ASSIGNED]: {
        mainAction: DATA_COLLECTION,
        rejectAction: DRAFT,
        cancelPossibility: true
    },
    [DATA_COLLECTION]: {
        mainAction: REPORT_FINALIZATION,
        cancelPossibility: true
    },
    [REPORT_FINALIZATION]: {
        mainAction: SUBMITTED,
        cancelPossibility: true
    },
    [SUBMITTED]: {
        mainAction: COMPLETED
    }
};

export type ActivityStatus = 'draft' | 'checklist' | 'review' | 'assigned' |
    'data_collection' | 'report_finalization' | 'submitted' | 'completed' | 'cancelled';

export type ActivityTransition = {
    mainAction: ActivityStatus | ComplexMainActionData;
    backAction?: ActivityStatus;
    cancelPossibility?: true;
    rejectAction?: ActivityStatus;
};

export type ComplexMainActionData = { staff: ActivityStatus; tpm: ActivityStatus };
