import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-profile-dropdown/etools-profile-dropdown';
import '../../common/layout/support-btn';
import './countries-dropdown';

import {connect} from 'pwa-helpers/connect-mixin.js';
import {store} from '../../../redux/store';

import {isProductionServer, isStagingServer, ROOT_PATH} from '../../../config/config';
import {css, CSSResultArray, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
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
export class PageHeader extends connect(store)(LitElement) {
  @property({type: Boolean})
  isStaging = false;

  rootPath: string = ROOT_PATH;

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

  //TODO list loading
  languages: DefaultDropdownOption<string>[] = [{value: 'en', display_name: 'English'}];

  @property() selectedLanguage = 'en';

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
          this.showSaveNotification('Profile data not saved. Save profile error!');
        }
        if (!userState.isRequest && !userState.error) {
          this.profileSaveLoadingMsgDisplay(false);
        }
      })
    );
    // TODO remove test code.
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    window.enableExampleLanguage = () => {
      this.languages = [...this.languages, {value: 'ru', display_name: 'Example Language'}];
      this.performUpdate();
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
          margin-right: 5px;
          max-width: 200px;
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
          margin-left: 20px;
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
          <etools-app-selector id="selector" .user="${this.profile}"></etools-app-selector>
          <img
            id="app-logo"
            class="logo"
            src="${this.rootPath}assets/images/etools-logo-color-white.svg"
            alt="eTools"
          />
          ${this.isStaging ? html` <div class="envWarning">- STAGING TESTING ENVIRONMENT</div> ` : ''}
        </div>
        <div class="header__item header__right-group">
          <div class="dropdowns">
            <etools-dropdown
              .selected="${this.selectedLanguage}"
              .options="${this.languages}"
              option-label="display_name"
              option-value="value"
              @etools-selected-item-changed="${({detail}: CustomEvent) =>
                this.languageChanged(detail.selectedItem.value)}"
              trigger-value-change-event
              hide-search
              allow-outside-scroll
              no-label-float
              .minWidth="160px"
              .autoWidth="${true}"
            ></etools-dropdown>

            <countries-dropdown></countries-dropdown>
          </div>

          <support-btn></support-btn>

          <etools-profile-dropdown
            .sections="${this.profileDrSections}"
            .offices="${this.profileDrOffices}"
            .users="${this.profileDrUsers}"
            .profile="${this.profile ? {...this.profile} : {}}"
            @save-profile="${this.handleSaveProfile}"
            @sign-out="${this._signOut}"
          >
          </etools-profile-dropdown>
          <paper-icon-button class="refresh-button" icon="refresh" @tap="${() => this.refresh()}"> </paper-icon-button>
        </div>
      </app-toolbar>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.setBgColor();
    this.isStaging = isStagingServer();
  }

  stateChanged(state: IRootState): void {
    if (state) {
      this.profile = state.user.data as IEtoolsUserModel;
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
  }

  refresh(): void {
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
