import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-profile-dropdown/etools-profile-dropdown';
import '../../common/layout/support-btn';
import './countries-dropdown';

import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../../../redux/store';

import {isProductionServer, isStagingServer, isDevServer, isDemoServer, ROOT_PATH} from '../../../config/config';
import {css, CSSResultArray, customElement, html, LitElement, property, query, TemplateResult} from 'lit-element';
import {UpdateDrawerState} from '../../../redux/actions/app.actions';
import {pageHeaderStyles} from './page-header-styles';
import {isEmpty} from 'ramda';
import {fireEvent} from '../../utils/fire-custom-event';
import {updateCurrentUserData} from '../../../redux/effects/user.effects';
import {currentUser, userSelector} from '../../../redux/selectors/user.selectors';

import {use} from 'lit-translate';
import {countriesDropdownStyles} from './countries-dropdown-styles';
import {ActiveLanguageSwitched} from '../../../redux/actions/active-language.actions';
import {activeLanguage} from '../../../redux/reducers/active-language.reducer';
import {etoolsCustomDexieDb} from '../../../endpoints/dexieDb';
import {translate} from 'lit-translate';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {parseRequestErrorsAndShowAsToastMsgs} from '@unicef-polymer/etools-ajax/ajax-error-parser.js';
import {EtoolsDropdownEl} from '@unicef-polymer/etools-dropdown/etools-dropdown';
import {appLanguages} from '../../../config/app-constants';

// registerTranslateConfig({loader: (lang: string) => fetch(`assets/i18n/${lang}.json`).then((res: any) => res.json())});

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

  @property() refreshInProgress = false;

  @property({type: Boolean})
  langUpdateInProgress = false;

  @property({type: Boolean})
  isProduction = false;

  @property({type: String})
  environment = 'LOCAL';

  @query('#languageSelector') private languageDropdown!: EtoolsDropdownEl;

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
          this.showSaveNotification('Profile data not saved. Save profile error!');
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
      css`
        .refresh-button {
          color: #bcc1c6;
          margin-right: 10px;
        }
        .dropdowns {
          display: flex;
          margin-right: 20px;
        }
        .header {
          flex-wrap: wrap;
          height: 100%;
          justify-content: space-between;
        }
        .nav-menu-button {
          min-width: 70px;
        }
        .header__item {
          display: flex;
          align-items: center;
        }
        .header__left-group {
        }
        .header__right-group {
          justify-content: space-evenly;
        }
        .logo {
          margin: 0 10px 0 20px;
        }
        @media (max-width: 380px) {
          .header__item {
            flex-grow: 1;
          }
        }
      `
    ];
  }

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      ${countriesDropdownStyles}
      <style>
        app-toolbar {
          background-color: ${this.headerColor};
        }
      </style>

      <app-toolbar sticky class="content-align header">
        <div class="header__item header__left-group">
          <paper-icon-button
            id="menuButton"
            class="nav-menu-button"
            icon="menu"
            @tap="${() => this.menuBtnClicked()}"
          ></paper-icon-button>
          <etools-app-selector
            id="selector"
            .iconTitle="${translate('NAVIGATION_MENU.APPSELECTOR')}"
            .user="${this.profile}"
          ></etools-app-selector>
          <img
            id="app-logo"
            class="logo"
            src="${this.rootPath}assets/images/etools-logo-color-white.svg"
            alt="eTools"
          />
          ${this.isProduction
            ? ``
            : html`<div class="envWarning">
            <span class='envLong'> - </span>${this.environment} <span class='envLong'>TESTING ENVIRONMENT<span></div>`}
        </div>
        <div class="header__item header__right-group">
          <div class="dropdowns">
            <etools-dropdown
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
              .readonly="${this.langUpdateInProgress}"
              .autoWidth="${true}"
            ></etools-dropdown>

            <countries-dropdown></countries-dropdown>
          </div>

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
          <paper-icon-button
            title="${translate('NAVIGATION_MENU.REFRESH')}"
            class="refresh-button"
            icon="refresh"
            tracker="Refresh"
            @tap="${this.refresh}"
          >
          </paper-icon-button>
        </div>
      </app-toolbar>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setBgColor();
    this.checkEnvironment();

    setTimeout(() => {
      const fitInto = document.querySelector('app-shell')!.shadowRoot!.querySelector('#appHeadLayout');
      this.languageDropdown.fitInto = fitInto;
    }, 0);
  }

  stateChanged(state: IRootState): void {
    if (state && state.user && state.user.data) {
      this.profile = state.user.data;
    }
    if (state.activeLanguage.activeLanguage && state.activeLanguage.activeLanguage !== this.selectedLanguage) {
      this.selectedLanguage = state.activeLanguage.activeLanguage;
      localStorage.setItem('defaultLanguage', this.selectedLanguage);
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
      localStorage.setItem('defaultLanguage', language);
      // Event caught by self translating npm packages
      fireEvent(this, 'language-changed', {language});
    }
    if (this.profile && this.profile.preferences?.language != language) {
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
      ? 'DEVELOPMENT'
      : isDemoServer()
      ? 'DEMO'
      : isStagingServer()
      ? 'STAGING'
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
      text: msg ? msg : 'All changes are saved.',
      showCloseBtn: false
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
    window.location.href = window.location.origin + '/logout';
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
