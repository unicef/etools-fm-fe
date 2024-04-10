import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';

import '@unicef-polymer/etools-unicef/src/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-unicef/src/etools-profile-dropdown/etools-profile-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-accesibility/etools-accesibility';
import '../../common/layout/support-btn';
import './countries-dropdown';
import './organizations-dropdown';

import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../../../redux/store';

import {
  isProductionServer,
  isStagingServer,
  isDevServer,
  isDemoServer,
  ROOT_PATH,
  isTestingServer
} from '../../../config/config';

import {html, LitElement, TemplateResult, CSSResultArray, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {UpdateDrawerState} from '../../../redux/actions/app.actions';
import {pageHeaderStyles} from './page-header-styles';
import {isEmpty} from 'ramda';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {updateCurrentUserData} from '../../../redux/effects/user.effects';
import {currentUser, userSelector} from '../../../redux/selectors/user.selectors';

import {use} from 'lit-translate';
import {headerDropdownStyles} from './header-dropdown-styles';
import {ActiveLanguageSwitched} from '../../../redux/actions/active-language.actions';
import {activeLanguage} from '../../../redux/reducers/active-language.reducer';
import {etoolsCustomDexieDb} from '../../../endpoints/dexieDb';
import {translate, get as getTranslation} from 'lit-translate';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-utils/dist/etools-ajax/ajax-error-parser';
import {appLanguages} from '../../../config/app-constants';
import {languageIsAvailableInApp} from '../../utils/utils';

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
  @property({type: String})
  headerColor = 'var(--header-bg-color)';

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

  @property() selectedLanguage!: string;
  @property() initialLanguage!: string;

  @property() refreshInProgress = false;

  @property({type: Boolean})
  langUpdateInProgress = false;

  @property({type: Boolean})
  isProduction = false;

  @property({type: String})
  environment = 'LOCAL';

  rootPath: string = ROOT_PATH;

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
    // TODO remove test code.
    // eslint-disable-next-line
    // @ts-ignore
    window.enableExampleLanguage = () => {
      appLanguages.splice(1, 0, {value: 'ru', display_name: 'Example Language'});
      this.requestUpdate();
    };
  }

  static get styles(): CSSResultArray {
    return [
      pageHeaderStyles,
      layoutStyles,
      css`
        .refresh-button {
          color: var(--header-color);
          margin-inline-end: 10px;
        }
        .titlebar {
          font-size: 28px;
          font-weight: 300;
        .dropdowns {
          display: flex;
          padding-block-start: 6px;
          margin-inline-end: 20px;
        }

        .nav-menu-button {
          min-width: 70px;
        }
        .logo {
          margin: 0 10px 0 20px;
        }

        .logo-wrapper {
          display: flex;
          align-items: center;
        }

        .envWarning {
          color: #000;
          background-color: var(--header-color);
          font-weight: 700;
          padding: 5px 10px;
          font-size: var(--etools-font-size-14, 14px);
          line-height: 1;
          border-radius: 10px;
        }
      `
    ];
  }

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      ${headerDropdownStyles}
      <style>
        app-toolbar {
          background-color: ${this.headerColor};
        }
        etools-accesibility {
          display: none;
        }
      </style>

      <app-toolbar sticky class="layout-horizontal align-items-center">
        <div class="titlebar layout-horizontal align-items-center">
          <etools-icon-button
            id="menuButton"
            class="nav-menu-button"
            name="menu"
            @click="${() => this.menuBtnClicked()}"
          ></etools-icon-button>
          <etools-app-selector
            id="selector"
            .user="${this.profile}"
            .language="${this.selectedLanguage}"
          ></etools-app-selector>
          <div class="logo-wrapper">
            <img
              id="app-logo"
              class="logo"
              src="${this.rootPath}assets/images/etools-logo-color-white.svg"
              alt="eTools"
            />
            ${this.isProduction
              ? ``
              : html`<div class="envWarning" title="${this.environment} TESTING ENVIRONMENT">${this.environment}</div>`}
          </div>
        </div>
        <div class="dropdown layout-horizontal align-items-center">
          <div>
            <etools-dropdown
              transparent
              id="languageSelector"
              .selected="${this.selectedLanguage}"
              .options="${appLanguages}"
              option-label="display_name"
              option-value="value"
              @etools-selected-item-changed="${({detail}: CustomEvent) => {
                if (detail.selectedItem) {
                  this.languageChanged(detail.selectedItem.value);
                }
              }}"
              trigger-value-change-event
              hide-search
              allow-outside-scroll
              no-label-float
              .disabled="${this.langUpdateInProgress}"
              min-width="120px"
              placement="bottom-end"
              .syncWidth="${false}"
            ></etools-dropdown>
          </div>

          <countries-dropdown></countries-dropdown>
          <organizations-dropdown></organizations-dropdown>
        </div>
        <div class="layout-horizontal align-items-center">
          <support-btn title="${translate('NAVIGATION_MENU.SUPPORT')}"></support-btn>

          <etools-profile-dropdown
            title="${translate('NAVIGATION_MENU.PROFILEANDSIGNOUT')}"
            .sections="${this.profileDrSections}"
            .offices="${this.profileDrOffices}"
            .users="${this.profileDrUsers}"
            .language="${this.selectedLanguage}"
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
    this.setBgColor();
    this.checkEnvironment();
  }

  stateChanged(state: IRootState): void {
    if (state && state.user && state.user.data) {
      this.profile = state.user.data;
    }
    if (state.activeLanguage.activeLanguage && state.activeLanguage.activeLanguage !== this.selectedLanguage) {
      this.selectedLanguage = state.activeLanguage.activeLanguage;
      window.EtoolsLanguage = this.selectedLanguage;
      this.initialLanguage = this.selectedLanguage;
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

  languageChanged(language: string): void {
    use(language).finally(() => store.dispatch(new ActiveLanguageSwitched(language)));

    if (language !== this.selectedLanguage) {
      this.selectedLanguage = language;
      window.EtoolsLanguage = language;
      // Event caught by self translating npm packages
      fireEvent(this, 'language-changed', {language});
    }
    if (
      this.profile &&
      this.profile.preferences?.language != language &&
      this.initialLanguage != language &&
      languageIsAvailableInApp(language)
    ) {
      this.langUpdateInProgress = true;
      store
        .dispatch<AsyncEffect>(updateCurrentUserData({preferences: {language: language}}))
        .catch((err: any) => parseRequestErrorsAndShowAsToastMsgs(err, this))
        .finally(() => (this.langUpdateInProgress = false));
    }
  }

  refresh(e: CustomEvent): void {
    this.trackAnalytics(e);
    if (!this.refreshInProgress) {
      this.refreshInProgress = true;
      localStorage.clear();
      etoolsCustomDexieDb.delete().finally(() => window.location.reload());
    }
  }

  protected checkEnvironment(): void {
    this.isProduction = isProductionServer();
    this.environment = isDevServer()
      ? 'DEV'
      : isDemoServer()
      ? 'DEMO'
      : isStagingServer()
      ? 'STAGE'
      : isTestingServer()
      ? 'TEST'
      : 'LOCAL';
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

  private setBgColor(): void {
    // If not production environment, changing header color to red
    if (!isProductionServer()) {
      this.headerColor = 'var(--nonprod-header-color)';
    }
  }
}
