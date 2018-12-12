import {
    ChecklistActions,
    SET_CHECKLIST_CATEGORIES,
    SET_CHECKLIST_CP_OUTPUTS,
    SET_CHECKLIST_ITEMS,
    SET_CHECKLIST_METHOD_TYPES
} from '../actions/checklist.actions';

const INITIAL = {
    requestInProcess: null,
    errors: {}
};

export function checklist(state = INITIAL, action: ChecklistActions) {
    switch (action.type) {
        case SET_CHECKLIST_CP_OUTPUTS:
            return Object.assign({}, state, {cpOutputs: action.payload});
        case SET_CHECKLIST_CATEGORIES:
            return Object.assign({}, state, {categories: action.payload});
        case SET_CHECKLIST_ITEMS:
            return Object.assign({}, state, {items: action.payload});
        case SET_CHECKLIST_METHOD_TYPES:
            return Object.assign({}, state, {methodTypes: action.payload});
        default:
            return state;
    }
}
