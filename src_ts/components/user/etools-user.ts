import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin';
import { property } from '@polymer/decorators/lib/decorators';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../redux/store';
import { getEndpoint } from '../../endpoints/endpoints';
import { CHANGE_COUNTRY, PROFILE_ENDPOINT } from '../../endpoints/endpoints-list';
import { UpdateUserData } from '../../redux/actions/user';

/**
 * @customElement
 * @polymer
 * @appliesMixin EtoolsAjaxRequestMixin
 */
export class EtoolsUser extends connect(store)(EtoolsAjaxRequestMixin(PolymerElement)) {

    @property({ type: Object, notify: true })
    public userData: IEtoolsUserModel | null = null;

    private profileEndpoint: IEtoolsEndpoint = getEndpoint(PROFILE_ENDPOINT);
    private changeCountryEndpoint: IEtoolsEndpoint = getEndpoint(CHANGE_COUNTRY);

    public stateChanged(state: IRootState): void {
        this.userData = state.user!.data;
        console.log('[EtoolsUser]: store user data received', state.user!.data);
    }

    public getUserData(): Promise<IEtoolsUserModel> {
        return this.sendRequest({ endpoint: this.profileEndpoint }).then((response: IEtoolsUserModel) => {
            // console.log('response', response);
            store.dispatch(new UpdateUserData(response));
        }).catch((error: GenericObject) => {
            console.error('[EtoolsUser]: getUserData req error...', error);
            throw error;
        });
    }

    public updateUserData(profile: GenericObject): Promise<IEtoolsUserModel> {
        return this.sendRequest({
            method: 'PATCH',
            endpoint: this.profileEndpoint,
            body: profile
        }).then((response: IEtoolsUserModel) => {
            store.dispatch(new UpdateUserData(response));
        }).catch((error: GenericObject) => {
            console.error('[EtoolsUser]: updateUserData req error ', error);
            throw error;
        });
    }

    public changeCountry(countryId: number): Promise<any> {
        return this.sendRequest({
            method: 'POST',
            endpoint: this.changeCountryEndpoint,
            body: { country: countryId }
        }).catch((error: GenericObject) => {
            console.error('[EtoolsUser]: updateUserData req error ', error);
            throw error;
        });
    }

}

window.customElements.define('etools-user', EtoolsUser);
