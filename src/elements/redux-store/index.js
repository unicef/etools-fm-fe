import * as redux from 'redux';
import thunkMiddleware from 'redux-thunk';
import actionsMiddleware from './actions-middleware';

import { initialization } from './reducers/app-initialization.reducer';
import { userData } from './reducers/user-data.reducer';
import { staticData } from './reducers/static-data.reducer';
import { globalLoading } from './reducers/global-loading.reducer';
import { notifications } from './reducers/notification.reducer';

const red = redux.combineReducers({initialization, userData, staticData, globalLoading, notifications});
export const store = redux.createStore(red, redux.applyMiddleware(thunkMiddleware, actionsMiddleware));
