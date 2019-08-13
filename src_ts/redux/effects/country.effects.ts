import { Dispatch } from 'redux';
import { getEndpoint } from '../../endpoints/endpoints';
import { CHANGE_COUNTRY } from '../../endpoints/endpoints-list';
import { ErrorChangeCountry, FinishChangeCountry, StartChangeCountry } from '../actions/country.actions';
import { EtoolsRequest } from '../../endpoints/request';

export function changeCurrentUserCountry(countryId: number): (dispatch: Dispatch) => Promise<void> {
    return (dispatch: Dispatch) => {
        const endpoint: IEtoolsEndpoint = getEndpoint(CHANGE_COUNTRY);
        if (!endpoint) {
            console.error(`Can not load user data. Reason: endpoint was not found.`);
            return Promise.resolve();
        }

        dispatch(new StartChangeCountry());
        return EtoolsRequest.sendRequest({
            method: 'POST',
            endpoint,
            body: { country: countryId }
        }).catch((error: GenericObject) => {
            dispatch(new ErrorChangeCountry(error));
        }).then(() => {
            dispatch(new FinishChangeCountry());
        });
    };
}
