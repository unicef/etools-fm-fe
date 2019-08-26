import { store } from '../store';

export function createSelector<T>(selector: StoreSelectorFunction<T>, onChange: (state: T) => void, initialize: boolean = true): Callback {
    let currentState: T = selector(store.getState() as IRootState);
    if (initialize) {
        // Be ware: if you change state inside your onChange callback don't use initialize. That can lead to unexpected behavior
        onChange(currentState);
    }

    return () => {
        const nextState: T = selector(store.getState() as IRootState);
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    };
}

export function select<T>(selector: StoreSelectorFunction<T>): Selector<T> {
    return (onChange: (state: T) => void, initialize?: boolean) => createSelector(selector, onChange, initialize);
}
