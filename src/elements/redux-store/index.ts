import * as redux from 'redux';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';
import actionsMiddleware from './actions-middleware';

import { initialization } from './reducers/app-initialization.reducer';
import { userData } from './reducers/user-data.reducer';
import { staticData } from './reducers/static-data.reducer';
import { globalLoading } from './reducers/global-loading.reducer';
import { notifications } from './reducers/notification.reducer';
import { permissions } from './reducers/permissions.reducer';
import { cpOutputs } from './reducers/cp-outputs.reducer';
import { methodTypes } from './reducers/settings-method-types.reducer';
import { specificLocations } from './reducers/site-specific-locations.reducer';

const red = redux.combineReducers({
    initialization,
    userData,
    staticData,
    globalLoading,
    notifications,
    permissions,
    cpOutputs,
    methodTypes,
    specificLocations
});
export const store = redux.createStore(
    red,
    redux.applyMiddleware(thunkMiddleware as ThunkMiddleware<any>, actionsMiddleware)
);