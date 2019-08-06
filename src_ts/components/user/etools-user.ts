import { PolymerElement } from '@polymer/polymer/polymer-element.js';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin';
import { property } from '@polymer/decorators/lib/decorators';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../redux/store';
import { getEndpoint } from '../../endpoints/endpoints';
import { PROFILE_ENDPOINT } from '../../endpoints/endpoints-list';

/**
 * @customElement
 * @polymer
 * @appliesMixin EtoolsAjaxRequestMixin
 */
export class EtoolsUser extends connect(store)(EtoolsAjaxRequestMixin(PolymerElement)) {

    @property({ type: Object, notify: true })
    public userData: IEtoolsUserModel | null = null;

    private profileEndpoint: IEtoolsEndpoint = getEndpoint(PROFILE_ENDPOINT);

    public stateChanged(state: IRootState): void {
        this.userData = state.user!.data;
        console.log('[EtoolsUser]: store user data', state.user!.data);
    }

    public getUserData(): void {
        this.sendRequest({ endpoint: this.profileEndpoint }).then((response: GenericObject) => {
            console.log(response);
        }).catch((error: GenericObject) => {
            console.log(error);
        });
    }

}

window.customElements.define('etools-user', EtoolsUser);
