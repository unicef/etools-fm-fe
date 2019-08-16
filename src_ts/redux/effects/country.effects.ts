import { CountryActionTypes } from '../actions/country.actions';
import { getEndpoint } from '../../endpoints/endpoints';
import { CHANGE_COUNTRY } from '../../endpoints/endpoints-list';
import { request } from '../../endpoints/request';
import { IAsyncAction } from '../middleware';

export function changeCurrentUserCountry(countryId: number): IAsyncAction {
    return {
        types: [
            CountryActionTypes.CHANGE_COUNTRY_REQUEST,
            CountryActionTypes.CHANGE_COUNTRY_SUCCESS,
            CountryActionTypes.CHANGE_COUNTRY_FAILURE
        ],
        api: () => {
            const endpoint: IEtoolsEndpoint = getEndpoint(CHANGE_COUNTRY);
            if (!endpoint || !endpoint.url) {
                return Promise.reject();
            }
            return request(endpoint.url, {
                method: 'POST',
                body: JSON.stringify({
                    country: countryId
                })
            });
        }
    };
}
