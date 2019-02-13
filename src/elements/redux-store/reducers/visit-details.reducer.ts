import {
    SET_CURRENT_VISIT,
    SET_VISIT_DATA, SET_VISIT_OPTIONS, START_VISIT_DETAILS_LOADING, START_VISIT_OPTIONS_LOADING,
    STOP_VISIT_DETAILS_LOADING, STOP_VISIT_OPTIONS_LOADING,
    VisitDetailsActions
} from '../actions/visit-details.actions';

const INITIAL = {
    permissions: null,
    data: null,
    currentVisitId: null,
    loading: {
        detailsLoading: null,
        permissionsLoading: null
    }
};

export function visitDetails(state = INITIAL, action: VisitDetailsActions) {
    switch (action.type) {
        case SET_CURRENT_VISIT:
            return Object.assign({}, state, {currentVisitId: action.visitId});

        case SET_VISIT_DATA:
            if (state.currentVisitId !== action.visitId) { return state; }
            return Object.assign({}, state, {data: action.visit});

        case SET_VISIT_OPTIONS:
            if (state.currentVisitId !== action.visitId) { return state; }
            return Object.assign({}, state, {permissions: action.permissions});

        case START_VISIT_DETAILS_LOADING:
            const detailsLoadingStart = Object.assign({}, state.loading, {detailsLoading: true});
            return Object.assign({}, state, {loading: detailsLoadingStart});

        case STOP_VISIT_DETAILS_LOADING:
            const detailsLoadingStop = Object.assign({}, state.loading, {detailsLoading: true});
            return Object.assign({}, state, {loading: detailsLoadingStop});

        case START_VISIT_OPTIONS_LOADING:
            const optionsLoadingStart = Object.assign({}, state.loading, {detailsLoading: true});
            return Object.assign({}, state, {loading: optionsLoadingStart});

        case STOP_VISIT_OPTIONS_LOADING:
            const optionsLoadingStop = Object.assign({}, state.loading, {detailsLoading: true});
            return Object.assign({}, state, {loading: optionsLoadingStop});

        default:
            return state;
    }
}
