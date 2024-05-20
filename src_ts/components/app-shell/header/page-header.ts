import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';

import '@unicef-polymer/etools-unicef/src/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-unicef/src/etools-profile-dropdown/etools-profile-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-accesibility/etools-accesibility';
import '../../common/layout/support-btn';
import './countries-dropdown';
import './organizations-dropdown';
import './languages-dropdown';

import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {store} from '../../../redux/store';

import {html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {UpdateDrawerState} from '../../../redux/actions/app.actions';
import {isEmpty} from 'ramda';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {updateCurrentUserData} from '../../../redux/effects/user.effects';
import {currentUser, userSelector} from '../../../redux/selectors/user.selectors';

import {activeLanguage} from '../../../redux/reducers/active-language.reducer';
import {etoolsCustomDexieDb} from '../../../endpoints/dexieDb';
import {translate, get as getTranslation} from 'lit-translate';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';

store.addReducers({
  activeLanguage
});
/**
 * page header element
 * @LitElement
 * @customElement
 */
@customElement('page-header')
export class PageHeader extends connect(store)(MatomoMixin(LitElement)) {
  @property({type: Object})
  profile!: IEtoolsUserModel;

  @property({type: Object})
  profileDropdownData: any | null = null;

  @property({type: Array})
  offices: any[] = [];

  @property({type: Array})
  sections: any[] = [];

  @property({type: Array})
  users: any[] = [];

  @property({type: Array})
  profileDrOffices: any[] = [];

  @property({type: Array})
  profileDrSections: any[] = [];

  @property({type: Array})
  profileDrUsers: any[] = [];

  @property({type: Array})
  editableFields: string[] = ['office', 'section', 'job_title', 'phone_number', 'oic', 'supervisor'];

  @property() refreshInProgress = false;

  constructor() {
    super();
    store.subscribe(
      currentUser((userDataState: IEtoolsUserModel | null) => {
        if (!userDataState) {
          this.showSaveNotification();
        }
      })
    );
    store.subscribe(
      userSelector((userState: IUserState) => {
        if (userState.error && !isEmpty(userState.error)) {
          this.showSaveNotification(getTranslation('ERROR_SAVE_PROFILE'));
        }
        if (!userState.isRequest && !userState.error) {
          this.profileSaveLoadingMsgDisplay(false);
        }
      })
    );
  }

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      <style>
        etools-accesibility {
          display: none;
        }
      </style>
      <app-toolbar
        @menu-button-clicked="${this.menuBtnClicked}"
        .profile=${this.profile}
        sticky
        class="content-align header"
      >
        <div slot="dropdowns">
          <languages-dropdown .profile="${this.profile}"></languages-dropdown>
          <countries-dropdown></countries-dropdown>
          <organizations-dropdown></organizations-dropdown>
        </div>
        <div slot="icons">
          <support-btn title="${translate('NAVIGATION_MENU.SUPPORT')}"></support-btn>

          <etools-profile-dropdown
            title="${translate('NAVIGATION_MENU.PROFILEANDSIGNOUT')}"
            .sections="${this.profileDrSections}"
            .offices="${this.profileDrOffices}"
            .users="${this.profileDrUsers}"
            .profile="${this.profile ? {...this.profile} : {}}"
            @save-profile="${this.handleSaveProfile}"
            @sign-out="${this._signOut}"
          >
          </etools-profile-dropdown>
          <etools-icon-button
            label="refresh"
            title="${translate('NAVIGATION_MENU.REFRESH')}"
            class="refresh-button"
            name="refresh"
            tracker="Refresh"
            @click="${this.refresh}"
          >
          </etools-icon-button>

          <etools-accesibility></etools-accesibility>
        </div>
      </app-toolbar>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
  }

  stateChanged(state: IRootState): void {
    if (state && state.user && state.user.data) {
      this.profile = state.user.data;
    }
  }

  handleSaveProfile(e: any): void {
    const modifiedFields: GenericObject = this._getModifiedFields(this.profile, e.detail.profile);
    if (isEmpty(modifiedFields)) {
      // empty profile means no changes found
      this.showSaveNotification();
      return;
    }
    this.profileSaveLoadingMsgDisplay();
    store.dispatch<AsyncEffect>(updateCurrentUserData(modifiedFields));
  }

  menuBtnClicked(): void {
    store.dispatch(new UpdateDrawerState(true));
    // fireEvent(this, 'drawer');
  }

  refresh(e: CustomEvent): void {
    this.trackAnalytics(e);
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      localStorage.clear();
      etoolsCustomDexieDb.delete().finally(() => window.location.reload());
    }
  }

  protected profileSaveLoadingMsgDisplay(show = true): void {
    fireEvent(this, 'global-loading', {
      active: show,
      loadingSource: 'profile-save'
    });
  }

  protected showSaveNotification(msg?: string): void {
    fireEvent(this, 'toast', {
      text: msg ? msg : getTranslation('CHANGES_SAVED')
    });
  }

  protected _getModifiedFields(originalData: any, newData: any): GenericObject {
    const modifiedFields: GenericObject = {};
    this.editableFields.forEach((field: any) => {
      if (originalData[field] !== newData[field]) {
        modifiedFields[field] = newData[field];
      }
    });

    return modifiedFields;
  }

  protected _signOut(): void {
    // this._clearDexieDbs();
    this.clearLocalStorage();
    window.location.href = window.location.origin + '/social/unicef-logout/';
  }

  // TODO
  // protected _clearDexieDbs() {
  //   window.EtoolsPmpApp.DexieDb.delete();
  // }

  protected clearLocalStorage(): void {
    localStorage.clear();
  }
}
