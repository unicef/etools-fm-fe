import {
  ASSIGNED,
  CHECKLIST,
  COMPLETED,
  DATA_COLLECTION,
  DRAFT,
  REPORT_FINALIZATION,
  REVIEW,
  SUBMITTED
} from '../components/pages/activities-and-data-collection/activity-item/statuses-actions/activity-statuses';

const PME: 'PME' = 'PME';
const FM_USER: 'FM User' = 'FM User';

// Add groups that are used in PERMISSIONS_MAP
const KNOWN_GROUPS: Set<string> = new Set([PME, FM_USER]);

let currentUserGroups: string[] | null = null;
let currentUser: number | null = null;

export enum Permissions {
  EDIT_SITES = 'EDIT_SITES',
  EDIT_RATIONALE = 'EDIT_RATIONALE',
  EDIT_LOG_ISSUES = 'EDIT_LOG_ISSUES',
  EDIT_QUESTIONS = 'EDIT_QUESTIONS',
  EDIT_QUESTION_TEMPLATES = 'EDIT_QUESTION_TEMPLATES',
  EDIT_VISIT_DETAILS = 'EDIT_VISIT_DETAILS',
  // Activity Permissions
  VIEW_CHECKLIST_TAB = 'VIEW_CHECKLIST_TAB',
  EDIT_CHECKLIST_TAB = 'EDIT_CHECKLIST_TAB',
  VIEW_REVIEW_TAB = 'VIEW_REVIEW_TAB',
  MAKE_STATUS_TRANSITION = 'MAKE_STATUS_TRANSITION',
  // Test permissions
  READONLY_TEST_PERMISSION = 'READONLY_TEST_PERMISSION',
  PME_TEST_PERMISSION = 'PME_TEST_PERMISSION',
  FM_USER_TEST_PERMISSION = 'PME_TEST_PERMISSION'
}

const PERMISSIONS_MAP: GenericObject<Set<Permissions>> = {
  [PME]: new Set([
    Permissions.PME_TEST_PERMISSION,
    Permissions.EDIT_SITES,
    Permissions.EDIT_LOG_ISSUES,
    Permissions.EDIT_RATIONALE,
    Permissions.EDIT_QUESTIONS,
    Permissions.EDIT_QUESTION_TEMPLATES,
    Permissions.EDIT_VISIT_DETAILS
  ]),
  [FM_USER]: new Set([
    Permissions.FM_USER_TEST_PERMISSION,
    Permissions.EDIT_LOG_ISSUES,
    Permissions.EDIT_RATIONALE,
    Permissions.EDIT_QUESTIONS,
    Permissions.EDIT_QUESTION_TEMPLATES
  ])
};

const ACTIVITY_PERMISSIONS_MAP: GenericObject<(details: IActivityDetails) => boolean> = {
  [Permissions.VIEW_CHECKLIST_TAB]: ({permissions, status}: IActivityDetails) =>
    permissions.view.activity_question_set && status === CHECKLIST,
  [Permissions.EDIT_CHECKLIST_TAB]: ({permissions}: IActivityDetails) => permissions.edit.activity_question_set,
  [Permissions.VIEW_REVIEW_TAB]: ({permissions, status}: IActivityDetails) =>
    permissions.view.activity_question_set && status === REVIEW,
  [Permissions.MAKE_STATUS_TRANSITION]: ({status, person_responsible}: IActivityDetails) => {
    if (!currentUserGroups || !currentUser) {
      return false;
    }
    switch (status) {
      case DRAFT:
      case CHECKLIST:
      case REVIEW:
      case SUBMITTED:
        return currentUserGroups.includes(PME) || currentUserGroups.includes(FM_USER);
      case ASSIGNED:
      case DATA_COLLECTION:
      case REPORT_FINALIZATION:
        return person_responsible !== null && currentUser === person_responsible.id;
      case COMPLETED:
        return false;
      default:
        throw new Error(`Unknown status "${status}"`);
    }
  }
};

export function setUser({user, groups}: IEtoolsUserModel): void {
  currentUser = user;
  currentUserGroups = groups
    .map((group: UserGroup) => group.name)
    .filter((groupName: string) => KNOWN_GROUPS.has(groupName));
}

export function hasPermission(permission: Permissions): boolean {
  if (!currentUserGroups) {
    console.warn('[Permissions]: User groups was not loaded');
    return false;
  }

  return currentUserGroups.some((groupName: string) => PERMISSIONS_MAP[groupName].has(permission));
}

export function hasActivityPermission(permissionName: string, activityDetails: IActivityDetails): boolean {
  return ACTIVITY_PERMISSIONS_MAP[permissionName] && ACTIVITY_PERMISSIONS_MAP[permissionName](activityDetails);
}
