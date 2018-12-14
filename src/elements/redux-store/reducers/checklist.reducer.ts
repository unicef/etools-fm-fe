import {
    ChecklistActions,
    FINISH_REQUEST_CHECKLIST_CONFIG,
    SET_CHECKLIST_CATEGORIES,
    SET_CHECKLIST_CP_OUTPUTS_CONFIGS,
    SET_CHECKLIST_ITEMS,
    SET_CHECKLIST_METHOD_TYPES,
    SET_ERROR_CHECKLIST_CONFIG,
    START_REQUEST_CHECKLIST_CONFIG, UPDATE_CHECKLIST_CONFIG
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
        case UPDATE_CHECKLIST_CONFIG:
            // @ts-ignore
            const configs: CpOutputConfig[] = [...state.cpOutputsConfigs];
            const indexUpdated = configs.findIndex((config: CpOutputConfig) => config.id === action.payload.id);
            if (indexUpdated > -1) { configs[indexUpdated] = action.payload; }
            return Object.assign({}, state, {cpOutputsConfigs: configs});
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
