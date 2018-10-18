import { ADD_STATIC_DATA, UPDATE_STATIC_DATA, RESET_STATIC_DATA } from '../actions/static-data.actions';

const INITIAL = {};

export function staticData(state = INITIAL, action) {
    const {dataName, payload: data = []} = action;
    switch (action.type) {
        case ADD_STATIC_DATA:
            if (state[dataName]) {
                throw new Error(`Data "${dataName}" was already added. Use Reset or Update actions.`);
            }
            return {
                [dataName]: data,
                ...state
            };

        case UPDATE_STATIC_DATA:
            if (!state[dataName]) {
                throw new Error(`Data "${dataName}" is missing. Use Add data action first.`);
            }
            const newStateData = {...state};
            const staticData = newStateData[dataName];
            newStateData[dataName] = [...staticData, data];
            return newStateData;

        case RESET_STATIC_DATA:
            if (!state[dataName]) {
                throw new Error(`Data "${dataName}" is missing. Use Add data action first.`);
            }
            return {
                ...state,
                [dataName]: data
            };

        default:
            return state;
    }
}
