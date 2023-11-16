import {store} from '../store';

export function createSelector<T>(
  selector: StoreSelectorFunction<T>,
  onChange: (state: T) => void,
  initialize = true
): Callback {
  let currentState: T = selector(store.getState() as IRootState);
  if (initialize) {
    // Be ware: if you change state inside your onChange callback don't use initialize.
    // That can lead to unexpected behavior
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

export function dynamicSelect<S, T>(selector: StoreSelectorFunction<S>): DynamicSelector<T | undefined> {
  return (onChange: (state: T | undefined) => void, path: string[] = [], initialize?: boolean) => {
    const composedSelector: StoreSelectorFunction<T | undefined> = composedDynamicSelector(selector, path);
    return createSelector<T | undefined>(composedSelector, onChange, initialize);
  };
}

function composedDynamicSelector<S, T>(
  selector: StoreSelectorFunction<S>,
  path: string[]
): StoreSelectorFunction<T | undefined> {
  return (rootState: IRootState) =>
    path.reduce((state: any, pathItem: string) => (state && state[pathItem]) || undefined, selector(rootState));
}
