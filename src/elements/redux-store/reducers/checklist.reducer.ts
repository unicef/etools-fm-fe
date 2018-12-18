import {
    ChecklistActions,
    FINISH_REQUEST_CHECKLIST_CONFIG,
    SET_CHECKLIST_CATEGORIES,
    SET_CHECKLIST_CP_OUTPUTS_CONFIGS,
    SET_CHECKLIST_ITEMS,
    SET_CHECKLIST_METHOD_TYPES, SET_CHECKLIST_PLANED,
    SET_ERROR_CHECKLIST_CONFIG,
    START_REQUEST_CHECKLIST_CONFIG, UPDATE_CHECKLIST_CONFIG, UPDATE_CHECKLIST_PLANED
} from '../actions/checklist.actions';

const INITIAL = {
    requestInProcess: null,
    errors: {}
};

export function checklist(state = INITIAL, action: ChecklistActions) {
    switch (action.type) {
        case SET_CHECKLIST_CP_OUTPUTS_CONFIGS:
            return Object.assign({}, state, {cpOutputsConfigs: action.payload});
        case SET_CHECKLIST_CATEGORIES:
            return Object.assign({}, state, {categories: action.payload});
        case SET_CHECKLIST_ITEMS:
            return Object.assign({}, state, {items: action.payload});
        case SET_CHECKLIST_PLANED:
            return Object.assign({}, state, {planedItems: action.payload});
        case UPDATE_CHECKLIST_CONFIG:
            // @ts-ignore
            const configs: CpOutputConfig[] = [...state.cpOutputsConfigs];
            const indexUpdated = configs.findIndex((config: CpOutputConfig) => config.id === action.payload.id);
            if (~indexUpdated) { configs[indexUpdated] = action.payload; }
            return Object.assign({}, state, {cpOutputsConfigs: configs});
        case UPDATE_CHECKLIST_PLANED:
            // @ts-ignore
            let planedItems: ChecklistPlanedItem[] = [...state.planedItems];
            const indexChecklistPlaned =
                planedItems.findIndex((config: ChecklistPlanedItem) => config.id === action.payload.id);
            if (~indexChecklistPlaned) {
                planedItems[indexChecklistPlaned] = action.payload;
            } else {
                planedItems = [...planedItems, action.payload];
            }
            return Object.assign({}, state, {planedItems});
        case SET_CHECKLIST_METHOD_TYPES:
            return Object.assign({}, state, {methodTypes: action.payload});
        case START_REQUEST_CHECKLIST_CONFIG:
            return Object.assign({}, state, {requestInProcess: true});
        case FINISH_REQUEST_CHECKLIST_CONFIG:
            return Object.assign({}, state, {requestInProcess: false});
        case SET_ERROR_CHECKLIST_CONFIG:
            return Object.assign({}, state, action.payload);
        default:
            return state;
    }
}
