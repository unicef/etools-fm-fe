import { store } from '../../redux-store';
import { Action } from 'redux';

window.FMMixins = window.FMMixins || {};
window.FMMixins.ReduxMixin = (superClass: any) => class extends superClass {

    public constructor() {
        super();
        this._store = store;
    }

    public subscribeOnStore(select: StoreSelectorFunction, onChange: (state: any) => any) {
        let currentState = select(this._store.getState());

        const unsubscribe = store.subscribe(() => {
            const nextState = select(this._store.getState());
            if (nextState !== currentState) {
                currentState = nextState;
                onChange(currentState);
            }
        });
        onChange(currentState);
        return unsubscribe;
    }

    public dispatchOnStore(action: Action) {
        this._store.dispatch(action);
    }

    public getFromStore(select: StoreSelector) {
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
