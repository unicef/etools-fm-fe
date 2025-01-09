/**
 @license
 Copyright (c) 2019 The eTools Project Authors. All rights reserved.
 */
import {connect, installMediaQueryWatcher, installRouter} from '@unicef-polymer/etools-utils/dist/pwa.utils';
// This element is connected to the Redux store.
import {store} from './redux/store';
// These are the elements needed by this element.
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-drawer-layout';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-drawer';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-header-layout';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-header';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-toolbar';
import '@unicef-polymer/etools-unicef/src/etools-app-layout/app-footer';
import '@unicef-polymer/etools-form-builder';
import '@unicef-polymer/etools-unicef/src/etools-toasts/etools-toasts';
import {createDynamicDialog} from '@unicef-polymer/etools-unicef/src/etools-dialog/dynamic-dialog';

import '@unicef-polymer/etools-piwik-analytics/etools-piwik-analytics.js';
import {AppShellStyles} from './components/app-shell/app-shell-styles';
import {RouterStyles} from './components/app-shell/router-style';

import './components/app-shell/menu/app-menu.js';
import './components/app-shell/header/page-header.js';

import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from './config/config';
import {getCurrentUserData} from './redux/effects/user.effects';
import {AppHeaderLayout} from '@unicef-polymer/etools-unicef/src/etools-app-layout/app-header-layout';
import {AppDrawer} from '@unicef-polymer/etools-unicef/src/etools-app-layout/app-drawer';

import {html, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

import {navigate} from './redux/effects/app.effects';
import {UpdateDrawerState} from './redux/actions/app.actions';
import {loadStaticData} from './redux/effects/load-static-data.effect';
import {user} from './redux/reducers/user.reducer';
import {country} from './redux/reducers/country.reducer';
import {organization} from './redux/reducers/organization.reducer';
import {CURRENT_WORKSPACE, LOCATIONS_ENDPOINT} from './endpoints/endpoints-list';
import {currentUser, userSelector} from './redux/selectors/user.selectors';
import {setUser} from './config/permissions';
import {appDrawerStyles} from './components/app-shell/menu/styles/app-drawer-styles';
import '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading';
import {globalLoadingSelector} from './redux/selectors/global-loading.selectors';
import {globalLoading} from './redux/reducers/global-loading.reducer';

import {registerTranslateConfig, use} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {checkEnvFlags} from './components/utils/check-flags';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';
import {ActiveLanguageSwitched} from './redux/actions/active-language.actions';
import {languageIsAvailableInApp} from './components/utils/utils';
import {MapHelper} from './components/common/map-mixin';
import {EtoolsRouteDetails} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {setBasePath} from '@shoelace-style/shoelace/dist/utilities/base-path.js';
import {initializeIcons} from '@unicef-polymer/etools-unicef/src/etools-icons/etools-icons';

registerTranslateConfig({
  empty: (key) => `${key && key[0].toUpperCase() + key.slice(1).toLowerCase()}`,
  loader: (lang: string) => fetch(`assets/i18n/${lang}.json`).then((res: any) => res.json())
});

setBasePath(Environment.basePath);
initializeIcons();

// These are the actions needed by this element.

store.addReducers({
  user,
  country,
  organization,
  globalLoading
});

/**
 * @customElement
 * @LitElement
 */
@customElement('app-shell')
export class AppShell extends connect(store)(LitElement) {
  @property({type: Boolean})
  narrow!: boolean;

  @property({type: Boolean})
  drawerOpened = false;

  @property({type: Object})
  routeDetails!: EtoolsRouteDetails;

  @property({type: String})
  mainPage = ''; // routeName

  @property({type: Object})
  user!: GenericObject;

  @property({type: String})
  subPage: string | null = null; // subRouteName

  @property({type: Boolean})
  smallMenu = false;

  @property({type: String})
  currentToastMessage = '';

  @property()
  globalLoadingMessage: string | null = null;

  @property({type: String})
  selectedLanguage!: string;

  @property({type: Boolean})
  hasLoadedTranslationFile = false;

  @query('#drawer') private drawer!: AppDrawer;
  @query('#appHeadLayout') private appHeaderLayout!: AppHeaderLayout;

  private selectedLanguageAux = '';

  constructor() {
    super();

    const menuTypeStoredVal: string | null = localStorage.getItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY);
    if (!menuTypeStoredVal) {
      this.smallMenu = false;
    } else {
      this.smallMenu = !!parseInt(menuTypeStoredVal, 10);
    }

    new MapHelper().arcgisMapIsAvailable().then((res: boolean) => {
      localStorage.setItem('arcgisMapIsAvailable', JSON.stringify(res));
    });

    store.subscribe(
      userSelector((userState: IUserState) => {
        if (userState.error && userState.error.status === 403) {
          window.location.href = window.location.origin + '/';
        }
      })
    );

    store.dispatch<AsyncEffect>(loadStaticData(LOCATIONS_ENDPOINT));
    store.dispatch<AsyncEffect>(loadStaticData(CURRENT_WORKSPACE));

    store.subscribe(
      currentUser((userData: IEtoolsUserModel | null) => {
        if (!userData) {
          return;
        }
        this.user = userData;
        setUser(userData);

        this.setCurrentLanguage(userData.preferences?.language);
      })
    );
  }

  setCurrentLanguage(lngCode: string): void {
    let currentLanguage = '';
    if (lngCode) {
      lngCode = lngCode.substring(0, 2);
      if (languageIsAvailableInApp(lngCode)) {
        currentLanguage = lngCode;
      } else {
        console.log(`User profile language ${lngCode} missing`);
      }
    }

    if (!currentLanguage) {
      currentLanguage = 'en';
    }
    window.EtoolsLanguage = currentLanguage;
    store.dispatch(new ActiveLanguageSwitched(currentLanguage));
  }

  static get styles(): CSSResultArray {
    return [appDrawerStyles, AppShellStyles, RouterStyles];
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.checkAppVersion();
    installRouter((location: Location) =>
      store.dispatch<AsyncEffect>(navigate(decodeURIComponent(location.pathname + location.search)))
    );
    installMediaQueryWatcher(`(min-width: 460px)`, () => store.dispatch(new UpdateDrawerState(!this.drawerOpened)));

    checkEnvFlags().then(() => store.dispatch<AsyncEffect>(getCurrentUserData()));
    store.subscribe(
      globalLoadingSelector((globalLoadingMessage: string | null) => {
        this.globalLoadingMessage = globalLoadingMessage;
      })
    );
  }

  firstUpdated(_changedProperties: any): void {
    super.firstUpdated(_changedProperties);

    setTimeout(() => {
      window.EtoolsEsmmFitIntoEl = this.appHeaderLayout.shadowRoot!.querySelector('#contentContainer');
    }, 100);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
  }

  async stateChanged(state: IRootState): Promise<void> {
    this.routeDetails = state.app.routeDetails;
    this.mainPage = state.app.routeDetails.routeName;
    this.subPage = state.app.routeDetails.subRouteName;
    this.drawerOpened = state.app.drawerOpened;
    // reset currentToastMessage to trigger observer in etools-piwik when it's changed again
    this.currentToastMessage = '';

    if (state.activeLanguage?.activeLanguage && state.activeLanguage.activeLanguage !== this.selectedLanguageAux) {
      // selectedLanguageAux is used to avoid multiple [lang].json fetch until this.locadLocalization finishes
      this.selectedLanguageAux = state.activeLanguage.activeLanguage;
      await this.loadLocalization(state.activeLanguage.activeLanguage);
      // seletedLanguage has to be set after loadLocalization finishes to
      // trigger UI updates only after the [lang].json is loaded
      this.selectedLanguage = state.activeLanguage.activeLanguage;
    }
  }

  async loadLocalization(lang: string): Promise<void> {
    await use(lang || 'en');
    this.hasLoadedTranslationFile = true;
  }

  onDrawerToggle(): void {
    if (this.drawerOpened !== this.drawer.opened) {
      const newState = Boolean(this.drawer.opened);
      store.dispatch(new UpdateDrawerState(newState));
    }
  }

  toggleMenu(e: CustomEvent): void {
    this.smallMenu = e.detail.value;
  }

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      <etools-piwik-analytics
        .page="${Environment.basePath}${this.mainPage}"
        .user="${this.user}"
        .toast="${this.currentToastMessage}"
      >
      </etools-piwik-analytics>

      <etools-toasts></etools-toasts>

      <app-drawer-layout
        id="layout"
        responsive-width="850px"
        fullbleed
        ?narrow="${this.narrow}"
        ?small-menu="${this.smallMenu}"
      >
        <!-- Drawer content -->
        <app-drawer
          id="drawer"
          slot="drawer"
          transition-duration="350"
          @app-drawer-transitioned="${this.onDrawerToggle}"
          ?opened="${this.drawerOpened}"
          ?swipe-open="${this.narrow}"
          ?small-menu="${this.smallMenu}"
        >
          <!-- App main menu(left sidebar) -->
          <app-menu
            selected-option="${this.mainPage}"
            @toggle-small-menu="${(e: CustomEvent) => this.toggleMenu(e)}"
            ?small-menu="${this.smallMenu}"
            .selectedLanguage="${this.selectedLanguage}"
          ></app-menu>
        </app-drawer>

        <!-- Main content -->
        <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>
          <app-header slot="header" fixed shadow>
            <page-header id="pageheader"></page-header>
          </app-header>

          <!-- Main content -->
          <main role="main" class="main-content">
            <etools-loading
              ?active="${this.globalLoadingMessage}"
              loading-text="${this.globalLoadingMessage}"
            ></etools-loading>
            <templates-page
              class="page"
              ?active="${this.isActivePage(
                this.mainPage,
                'templates',
                this.subPage,
                'questions|issue-tracker|templates'
              )}"
            ></templates-page>
            <management-page
              class="page"
              ?active="${this.isActivePage(this.mainPage, 'management', this.subPage, 'rationale|sites')}"
            ></management-page>
            <activities-page class="page" ?active="${this.isActivePage(this.mainPage, 'activities')}"></activities-page>
            <analyze-page
              class="page"
              ?active="${this.isActivePage(
                this.mainPage,
                'analyze',
                this.subPage,
                'country-overview|monitoring-activity'
              )}"
            ></analyze-page>
            <partners-page class="page" ?active="${this.isActivePage(this.mainPage, 'partners')}"></partners-page>
            <page-not-found
              class="page"
              ?active="${this.isActivePage(this.mainPage, 'page-not-found')}"
            ></page-not-found>
          </main>

          <app-footer></app-footer>
        </app-header-layout>
      </app-drawer-layout>
    `;
  }

  protected isActiveMainPage(currentPageName: string, expectedPageName: string): boolean {
    return currentPageName === expectedPageName;
  }

  protected isActiveSubPage(currentSubPageName: string, expectedSubPageNames: string): boolean {
    const subPages: string[] = expectedSubPageNames.split('|');
    return subPages.includes(currentSubPageName);
  }

  protected isActivePage(
    pageName: string,
    expectedPageName: string,
    currentSubPageName?: string | null,
    expectedSubPageNames?: string
  ): boolean {
    if (!this.isActiveMainPage(pageName, expectedPageName)) {
      return false;
    }
    if (currentSubPageName && expectedSubPageNames) {
      return this.isActiveSubPage(currentSubPageName, expectedSubPageNames);
    }
    return true;
  }

  protected checkAppVersion(): void {
    fetch('version.json')
      .then((res) => res.json())
      .then((version) => {
        if (version.revision != document.getElementById('buildRevNo')!.innerText) {
          console.log('version.json', version.revision);
          console.log('buildRevNo ', document.getElementById('buildRevNo')!.innerText);
          this._showConfirmNewVersionDialog();
        }
      });
  }
  /**
   * Deplay UI initialization until translation files are loaded
   * Otherwise propeties that are initialised with translated strings will display the key.
   * Ex: @property() activityTypes: DefaultDropdownOption<string>[] = applyDropdownTranslation(MONITOR_TYPES);
   * @param changedProperties
   * @returns
   */
  protected shouldUpdate(changedProperties: Map<PropertyKey, unknown>): boolean {
    return this.hasLoadedTranslationFile && super.shouldUpdate(changedProperties);
  }

  private _showConfirmNewVersionDialog(): void {
    const msg = document.createElement('span');
    msg.innerText = 'A new version of the app is available. Refresh page?';
    const conf: any = {
      size: 'md',
      closeCallback: this._onConfirmNewVersion.bind(this),
      content: msg
    };
    const confirmNewVersionDialog = createDynamicDialog(conf);
    confirmNewVersionDialog.opened = true;
  }

  private _onConfirmNewVersion(e: CustomEvent): void {
    if (e.detail.confirmed) {
      if (navigator.serviceWorker) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            caches.delete(cacheName);
          });
          location.reload();
        });
      }
    }
  }
}
