import { PermissionsActions, SET_PERMISSIONS } from '../actions/permissions.actions';

const INITIAL: PermissionsCollections = {};

export function permissions(state = INITIAL, action: PermissionsActions) {
    switch (action.type) {
        case SET_PERMISSIONS:
            const {collectionName, payload} = action;
            const actions: IPermissionActions = managePermissions(payload);
            return {
                ...state,
                [collectionName]: actions
            };
        default:
            return state;
    }
}

function managePermissions(backendPermissions: IBackendPermissions): IPermissionActions {
    const actions: IBackendPermissionActions = backendPermissions.actions;
    const title: string = backendPermissions.name;

    const transitions: TransitionObject[] = actions.allowed_FSM_transitions || [];

    const allowedTransitions: TransitionObject[] = [];
    if (isValidCollection(actions.PUT)) {
        allowedTransitions.push({code: 'save', display_name: 'save'});
    }
    if (isValidCollection(actions.POST)) {
        allowedTransitions.push({code: 'create', display_name: 'create'});
    }

    return {
        ...actions, title,
        allowed_actions: transitions.concat(allowedTransitions)
    };
}

function isValidCollection(collection: Object | undefined) {
    return !!(collection && Object.keys(collection).length);
}