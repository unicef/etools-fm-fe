import { store } from '../../redux-store';

window.FMMixins = window.FMMixins || {};
window.FMMixins.ReduxMixin = superClass => class extends superClass {
    constructor() {
        super();
        this._store = store;
    }

    subscribeOnStore(select, onChange) {
        let currentState = select(this._store.getState());

        const unsubscribe = store.subscribe(() => {
            let nextState = select(this._store.getState());
            if (nextState !== currentState) {
                currentState = nextState;
                onChange(currentState);
            }
        });
        onChange(currentState);
        return unsubscribe;
    }

    dispatchOnStore(action) {
        this._store.dispatch(action);
    }

    getFromStore(select) {
        if (typeof select === 'string') {
            const state = this._store.getState();
            return _.get(state, select);
        } else if (typeof select === 'function') {
            return select(this._store.getState());
        } else {
            throw new Error('Please, provide correct selector');
        }
    }

};
