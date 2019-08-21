const PME: 'PME' = 'PME';
const FM_USER: 'FM User' = 'FM User';

// Add groups that are used in PERMISSIONS_MAP
const KNOWN_GROUPS: Set<string> = new Set([PME, FM_USER]);

export enum Permissions {
    EDIT_SITES = 'EDIT_SITES',
    EDIT_RATIONALE = 'EDIT_RATIONALE',
    EDIT_LOG_ISSUES = 'EDIT_LOG_ISSUES',
    EDIT_QUESTIONS = 'EDIT_QUESTIONS',
    EDIT_QUESTION_TEMPLATES = 'EDIT_QUESTION_TEMPLATES',
    // Test permissions
    READONLY_TEST_PERMISSION = 'READONLY_TEST_PERMISSION',
    PME_TEST_PERMISSION = 'PME_TEST_PERMISSION',
    FM_USER_TEST_PERMISSION = 'PME_TEST_PERMISSION'
}

const PERMISSIONS_MAP: { [key: string]: Set<Permissions>} = {
    [PME]: new Set([
        Permissions.PME_TEST_PERMISSION,
        Permissions.EDIT_SITES,
        Permissions.EDIT_LOG_ISSUES,
        Permissions.EDIT_RATIONALE,
        Permissions.EDIT_QUESTIONS,
        Permissions.EDIT_QUESTION_TEMPLATES
    ]),
    [FM_USER]: new Set([
        Permissions.FM_USER_TEST_PERMISSION,
        Permissions.EDIT_LOG_ISSUES,
        Permissions.EDIT_RATIONALE,
        Permissions.EDIT_QUESTIONS,
        Permissions.EDIT_QUESTION_TEMPLATES
    ])
};

let currentUserGroups: string[] | null = null;

export function setUserGroups(groups: UserGroup[]): void {
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
