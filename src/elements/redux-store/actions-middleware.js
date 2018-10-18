export default function actionsMiddleware() {
    return dispatch => action => dispatch({...action});
}
