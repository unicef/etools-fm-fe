import { store } from '../store';

export function createSelector<T>(selector: StoreSelectorFunction<T>, onChange: (state: T) => void): Callback {
    let currentState: T = selector(store.getState() as IRootState);
    onChange(currentState);

    return () => {
        const nextState: T = selector(store.getState() as IRootState);
        if (nextState !== currentState) {
            currentState = nextState;
            onChange(currentState);
        }
    };
}

export function select<T>(selector: StoreSelectorFunction<T>): Selector<T> {
    return (onChange: (state: T) => void) => createSelector(selector, onChange);
}
