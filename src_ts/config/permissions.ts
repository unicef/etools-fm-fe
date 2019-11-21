const PME: 'PME' = 'PME';
const FM_USER: 'FM User' = 'FM User';

// Add groups that are used in PERMISSIONS_MAP
const KNOWN_GROUPS: Set<string> = new Set([PME, FM_USER]);

let currentUserGroups: string[] | null = null;

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
  VIEW_CHECKLIST_TAB = 'VIEW_CHECKLIST_TAB',
  EDIT_CHECKLIST_TAB = 'EDIT_CHECKLIST_TAB',
  VIEW_REVIEW_TAB = 'VIEW_REVIEW_TAB',
  VIEW_COLLECT_TAB = 'VIEW_COLLECT_TAB',
  EDIT_COLLECT_TAB = 'EDIT_COLLECT_TAB',
  MAKE_STATUS_TRANSITION = 'MAKE_STATUS_TRANSITION',
  // Test permissions
  READONLY_TEST_PERMISSION = 'READONLY_TEST_PERMISSION',
  PME_TEST_PERMISSION = 'PME_TEST_PERMISSION',
  FM_USER_TEST_PERMISSION = 'PME_TEST_PERMISSION'
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
    Permissions.EDIT_VISIT_DETAILS
  ]),
  [FM_USER]: new Set([
    Permissions.VIEW_SETTINGS,
    Permissions.VIEW_PLANING,
    Permissions.VIEW_ANALYZE,
    Permissions.FM_USER_TEST_PERMISSION,
    Permissions.EDIT_LOG_ISSUES,
    Permissions.EDIT_RATIONALE,
    Permissions.EDIT_QUESTIONS,
    Permissions.EDIT_QUESTION_TEMPLATES
  ])
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
