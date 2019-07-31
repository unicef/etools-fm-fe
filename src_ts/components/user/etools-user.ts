import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import EtoolsAjaxRequestMixin from '@unicef-polymer/etools-ajax/etools-ajax-request-mixin';
import {property} from '@polymer/decorators/lib/decorators';
import {EtoolsUserModel} from './user-model';
import {connect} from 'pwa-helpers/connect-mixin';
import {RootState, store} from '../../redux/store';
import {getEndpoint} from '../../endpoints/endpoints';
import {GenericObject} from '../../types/globals';

const PROFILE_ENDPOINT = 'userProfile';

/**
 * @customElement
 * @polymer
 * @appliesMixin EtoolsAjaxRequestMixin
 */
export class EtoolsUser extends connect(store)(EtoolsAjaxRequestMixin(PolymerElement)) {

  @property({type: Object, notify: true})
  userData: EtoolsUserModel | null = null;

  private profileEndpoint = getEndpoint(PROFILE_ENDPOINT);

  public stateChanged(state: RootState) {
    this.userData = state.user!.data;
    console.log('[EtoolsUser]: store user data', state.user!.data);
  }

  public getUserData() {
    this.sendRequest({endpoint: this.profileEndpoint}).then((response: GenericObject) => {
      console.log(response);
    }).catch((error: GenericObject) => {
      console.log(error);
    });
  }

}

window.customElements.define('etools-user', EtoolsUser);
