import {applyMiddleware, combineReducers, compose, createStore, Store, StoreEnhancer} from 'redux';
import thunk from 'redux-thunk';
import {lazyReducerEnhancer, LazyStore} from '@unicef-polymer/etools-utils/dist/pwa.utils';

import app from './reducers/app.js';
import {actionsMiddleware, asyncActionMiddleware} from './middleware';
import {staticData} from './reducers/static-data.reducer';

// Sets up a Chrome extension for time travel debugging.
// See https://github.com/zalmoxisus/redux-devtools-extension for more information.
const devCompose: <Ext0, Ext1, StateExt0, StateExt1>(
  f1: StoreEnhancer<Ext0, StateExt0>,
  f2: StoreEnhancer<Ext1, StateExt1>
) => StoreEnhancer<Ext0 & Ext1, StateExt0 & StateExt1> = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

// Initializes the Redux store with a lazyReducerEnhancer (so that you can
// lazily add reducers after the store has been created) and redux-thunk (so
// that you can dispatch async actions). See the "Redux and state management"
// section of the wiki for more details:
// https://github.com/Polymer/pwa-starter-kit/wiki/4.-Redux-and-state-management
interface IStore extends LazyStore, Store {}

export const store: IStore = createStore(
  (state: any) => state,
  devCompose(lazyReducerEnhancer(combineReducers), applyMiddleware(thunk, actionsMiddleware, asyncActionMiddleware))
);

// Initially loaded reducers.
store.addReducers({app, staticData});

/**
 * IMPORTANT!
 * For any other reducers use lazy loading like this (in the element that needs the reducer)
 *    import counter from '../reducers/x-reducer.js';
 *    store.addReducers({
 *       xReducer
 *   });
 */
