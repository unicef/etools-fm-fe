import {Action, AnyAction, Dispatch, Middleware, MiddlewareAPI} from 'redux';

export function actionsMiddleware(): any {
  return (dispatch: Dispatch) => (action: Action) => dispatch({...action});
}

export interface IAsyncAction {
  types: string[];
  api: () => Promise<any>;
  payload?: GenericObject;
}

export const asyncActionMiddleware: Middleware =
  ({dispatch}: MiddlewareAPI) =>
  (next: (action: AnyAction) => any) =>
  (action: AnyAction) => {
    if (!action.types && !action.api) {
      return next(action);
    }

    const [requestAction, successAction, errorAction]: string[] = action.types;
    dispatch({
      type: requestAction
    });
    return action
      .api()
      .then((res: any) =>
        dispatch({
          type: successAction,
          payload: res
        })
      )
      .catch((res: Error) =>
        dispatch({
          type: errorAction,
          payload: res
        })
      );
  };
