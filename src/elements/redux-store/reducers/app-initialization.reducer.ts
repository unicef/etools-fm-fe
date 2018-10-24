import {
    FINISH_INITIALIZATION,
    FINISHED_INITIALIZATION_STATE,
    FinishInitialisation,
    IN_PROGRESS_INITIALIZATION_STATE,
    INITIAL_INITIALIZATION_STATE,
    INITIALIZE_APPLICATION,
    InitializeApplication } from '../actions/app-initialization.actions';
import { loadUserData } from '../effects/load-user-info.effect';
import { store } from '../index';
import { loadStaticData } from '../effects/load-static-data.effect';

type ActionType = FinishInitialisation | InitializeApplication;

const INITIAL = INITIAL_INITIALIZATION_STATE;

export function initialization(state: string = INITIAL, action: ActionType) {
    switch (action.type) {
        case INITIALIZE_APPLICATION:
            if (
                state === IN_PROGRESS_INITIALIZATION_STATE ||
                state === FINISHED_INITIALIZATION_STATE
            ) {
                console.warn('Initialization can be called only once');
                return state;
            }
            loadData((action as InitializeApplication).payload);
            return IN_PROGRESS_INITIALIZATION_STATE;
        case FINISH_INITIALIZATION:
            return FINISHED_INITIALIZATION_STATE;
        default:
            return state;
    }
}

function loadData(dataNames: string[]) {
    store
        .dispatch(loadUserData())
        .then(() => {
            let promises: Promise<void>[] = [];
            if (dataNames && dataNames.length) {
                promises = dataNames.map(dataName => store.dispatch(loadStaticData(dataName)));
            }
            return Promise.all(promises);
        })
        .then(() => {
            store.dispatch(new FinishInitialisation());
        });
}
