import { Action, Dispatch } from 'redux';

export default function actionsMiddleware(): any {
    return (dispatch: Dispatch) => (action: Action) => dispatch({ ...action });
}
