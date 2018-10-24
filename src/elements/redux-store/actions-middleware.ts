import { Action, Dispatch } from 'redux';

export default function actionsMiddleware() {
    return (dispatch: Dispatch) => (action: Action) => dispatch({...action});
}
