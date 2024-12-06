const PME = 'PME';
const FM_USER = 'FM User';
const UNICEF_USER = 'UNICEF User';

// Add groups that are used in PERMISSIONS_MAP
const KNOWN_GROUPS: Set<string> = new Set([PME, FM_USER, UNICEF_USER]);

let currentUserGroups: string[] | null = null;
// TODO: remove unused permissions
export enum Permissions {
  VIEW_SETTINGS = 'VIEW_SETTINGS',
  VIEW_PLANING = 'VIEW_PLANING',
  VIEW_ANALYZE = 'VIEW_ANALYZE',
  EDIT_SITES = 'EDIT_SITES',
  EDIT_RATIONALE = 'EDIT_RATIONALE',
  EDIT_LOG_ISSUES = 'EDIT_LOG_ISSUES',
  EDIT_QUESTIONS = 'EDIT_QUESTIONS',
  EDIT_QUESTION_TEMPLATES = 'EDIT_QUESTION_TEMPLATES',
  EDIT_VISIT_DETAILS = 'EDIT_VISIT_DETAILS',
  // Activity Permissions
  CREATE_VISIT = 'CREATE_VISIT',
  VIEW_CHECKLIST_TAB = 'VIEW_CHECKLIST_TAB',
  EDIT_CHECKLIST_TAB = 'EDIT_CHECKLIST_TAB',
  VIEW_REVIEW_TAB = 'VIEW_REVIEW_TAB',
  VIEW_COLLECT_TAB = 'VIEW_COLLECT_TAB',
  EDIT_COLLECT_TAB = 'EDIT_COLLECT_TAB',
  MAKE_STATUS_TRANSITION = 'MAKE_STATUS_TRANSITION',
  ADD_ACTION_POINT = 'ADD_ACTION_POINT',
  EDIT_ACTION_POINT = 'EDIT_ACTION_POINT',
  // Test permissions
  READONLY_TEST_PERMISSION = 'READONLY_TEST_PERMISSION',
  PME_TEST_PERMISSION = 'PME_TEST_PERMISSION',
  FM_USER_TEST_PERMISSION = 'FM_USER_TEST_PERMISSION'
}

const PERMISSIONS_MAP: GenericObject<Set<Permissions>> = {
  [PME]: new Set([
    Permissions.VIEW_SETTINGS,
    Permissions.VIEW_PLANING,
    Permissions.VIEW_ANALYZE,
    Permissions.EDIT_SITES,
    Permissions.EDIT_LOG_ISSUES,
    Permissions.EDIT_RATIONALE,
    Permissions.EDIT_QUESTIONS,
    Permissions.EDIT_QUESTION_TEMPLATES,
    Permissions.EDIT_VISIT_DETAILS,
    Permissions.ADD_ACTION_POINT,
    Permissions.EDIT_ACTION_POINT,
    Permissions.CREATE_VISIT
  ]),
  [FM_USER]: new Set([
    Permissions.VIEW_SETTINGS,
    Permissions.VIEW_PLANING,
    Permissions.VIEW_ANALYZE,
    Permissions.FM_USER_TEST_PERMISSION,
    Permissions.EDIT_LOG_ISSUES,
    Permissions.EDIT_RATIONALE,
    Permissions.EDIT_QUESTIONS,
    Permissions.EDIT_QUESTION_TEMPLATES,
    Permissions.ADD_ACTION_POINT,
    Permissions.EDIT_ACTION_POINT,
    Permissions.CREATE_VISIT
  ]),
  [UNICEF_USER]: new Set([Permissions.VIEW_SETTINGS, Permissions.VIEW_PLANING, Permissions.VIEW_ANALYZE])
};

export function setUser({groups}: IEtoolsUserModel): void {
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
