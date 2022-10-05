/**
 @license
 Copyright (c) 2019 The eTools Project Authors. All rights reserved.
 */
import {setPassiveTouchGestures} from '@polymer/polymer/lib/utils/settings';
import {connect} from 'pwa-helpers/connect-mixin';
import {installMediaQueryWatcher} from 'pwa-helpers/media-query';
import {installRouter} from 'pwa-helpers/router';
// This element is connected to the Redux store.
import {store} from '../../redux/store';
// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';
import '@unicef-polymer/etools-form-builder';
import {createDynamicDialog} from '@unicef-polymer/etools-dialog/dynamic-dialog';

import '@unicef-polymer/etools-piwik-analytics/etools-piwik-analytics.js';
import {AppShellStyles} from './app-shell-styles';
import {RouterStyles} from './router-style';

import './menu/app-menu.js';
import './header/page-header.js';
import './footer/page-footer.js';

import './app-theme.js';
import {ToastNotificationHelper} from '../common/toast-notifications/toast-notification-helper';
import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../config/config';
import {getCurrentUserData} from '../../redux/effects/user.effects';
import {AppDrawerLayoutElement} from '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import {AppHeaderLayoutElement} from '@polymer/app-layout/app-header-layout/app-header-layout';
import {AppDrawerElement} from '@polymer/app-layout/app-drawer/app-drawer';
import {CSSResultArray, customElement, html, LitElement, property, query, TemplateResult} from 'lit-element';
import {navigate} from '../../redux/effects/app.effects';
import {UpdateDrawerState} from '../../redux/actions/app.actions';
import {loadStaticData} from '../../redux/effects/load-static-data.effect';
import {user} from '../../redux/reducers/user.reducer';
import {country} from '../../redux/reducers/country.reducer';
import {CURRENT_WORKSPACE, LOCATIONS_ENDPOINT} from '../../endpoints/endpoints-list';
import {currentUser, userSelector} from '../../redux/selectors/user.selectors';
import {setUser} from '../../config/permissions';
import {appDrawerStyles} from './menu/styles/app-drawer-styles';
import '@unicef-polymer/etools-loading';
import {globalLoadingSelector} from '../../redux/selectors/global-loading.selectors';
import {globalLoading} from '../../redux/reducers/global-loading.reducer';

import {registerTranslateConfig, use} from 'lit-translate';
import {checkEnvFlags} from '../utils/check-flags';
import {ROOT_PATH} from '../../config/config';
import {languageIsAvailableInApp} from '../utils/utils';
import {ActiveLanguageSwitched} from '../../redux/actions/active-language.actions';
declare const dayjs: any;
declare const dayjs_plugin_utc: any;
declare const dayjs_plugin_isSameOrBefore: any;

dayjs.extend(dayjs_plugin_utc);
dayjs.extend(dayjs_plugin_isSameOrBefore);

registerTranslateConfig({
  loader: (lang: string) => fetch(`assets/i18n/${lang}.json`).then((res: any) => res.json())
});

// These are the actions needed by this element.

store.addReducers({
  user,
  country,
  globalLoading
});

/**
 * @customElement
 * @LitElement
 */
@customElement('app-shell')
export class AppShell extends connect(store)(LitElement) {
  @property({type: Boolean})
  narrow = true;

  @property({type: Boolean})
  drawerOpened = false;

  @property({type: Object})
  routeDetails!: IRouteDetails;

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

  @property({type: String})
  selectedLanguage!: string;

  @property()
  globalLoadingMessage: string | null = null;

  @query('#layout') private drawerLayout!: AppDrawerLayoutElement;
  @query('#drawer') private drawer!: AppDrawerElement;
  @query('#appHeadLayout') private appHeaderLayout!: AppHeaderLayoutElement;

  private appToastsNotificationsHelper!: ToastNotificationHelper;
  private hasLoadedStrings = false;

  constructor() {
    super();
    // Gesture events like tap and track generated from touch will not be
    // preventable, allowing for better scrolling performance.
    setPassiveTouchGestures(true);
    // init toasts notifications queue
    this.appToastsNotificationsHelper = new ToastNotificationHelper();
    this.appToastsNotificationsHelper.addToastNotificationListeners();
    this.appToastsNotificationsHelper.appShellEl = this;

    const menuTypeStoredVal: string | null = localStorage.getItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY);
    if (!menuTypeStoredVal) {
      this.smallMenu = false;
    } else {
      this.smallMenu = !!parseInt(menuTypeStoredVal, 10);
    }

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

  static get styles(): CSSResultArray {
    return [appDrawerStyles, AppShellStyles, RouterStyles];
  }

  async connectedCallback(): Promise<void> {
    super.connectedCallback();

    this.checkAppVersion();
    installRouter((location: Location) =>
      store.dispatch<AsyncEffect>(navigate(decodeURIComponent(location.pathname + location.search)))
    );
    installMediaQueryWatcher(`(min-width: 460px)`, () => store.dispatch(new UpdateDrawerState(false)));

    checkEnvFlags().then(() => store.dispatch<AsyncEffect>(getCurrentUserData()));
    store.subscribe(
      globalLoadingSelector((globalLoadingMessage: string | null) => {
        this.globalLoadingMessage = globalLoadingMessage;
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    // remove toasts notifications listeners
    this.appToastsNotificationsHelper.removeToastNotificationListeners();
  }

  firstUpdated(_changedProperties: any): void {
    super.firstUpdated(_changedProperties);

    setTimeout(() => {
      window.EtoolsEsmmFitIntoEl = this.appHeaderLayout.shadowRoot!.querySelector('#contentContainer');
    }, 100);
  }

  stateChanged(state: IRootState): void {
    this.routeDetails = state.app.routeDetails;
    this.mainPage = state.app.routeDetails.routeName;
    this.subPage = state.app.routeDetails.subRouteName;
    this.drawerOpened = state.app.drawerOpened;
    // reset currentToastMessage to trigger observer in etools-piwik when it's changed again
    this.currentToastMessage = '';

    if (state.activeLanguage?.activeLanguage && state.activeLanguage.activeLanguage !== this.selectedLanguage) {
      this.selectedLanguage = state.activeLanguage.activeLanguage;
      this.loadLocalization();
    }
  }

  async loadLocalization(): Promise<void> {
    await use(this.selectedLanguage);
    this.hasLoadedStrings = true;
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
      const storageLang = localStorage.getItem('defaultLanguage');
      if (storageLang && languageIsAvailableInApp(storageLang)) {
        currentLanguage = storageLang;
      }
    }
    if (!currentLanguage) {
      currentLanguage = 'en';
    }

    store.dispatch(new ActiveLanguageSwitched(currentLanguage));
  }

  onDrawerToggle(): void {
    if (this.drawerOpened !== this.drawer.opened) {
      const newState = Boolean(this.drawer.opened);
      store.dispatch(new UpdateDrawerState(newState));
    }
  }

  toggleMenu(e: CustomEvent): void {
    this.smallMenu = e.detail.value;
    this._updateDrawerStyles();
    this._notifyLayoutResize();
  }

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      <etools-piwik-analytics
        .page="${ROOT_PATH}${this.mainPage}"
        .user="${this.user}"
        .toast="${this.currentToastMessage}"
      >
      </etools-piwik-analytics>

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
            <page-not-found
              class="page"
              ?active="${this.isActivePage(this.mainPage, 'page-not-found')}"
            ></page-not-found>
          </main>

          <page-footer></page-footer>
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

  protected shouldUpdate(changedProperties: Map<PropertyKey, unknown>): boolean {
    return this.hasLoadedStrings && super.shouldUpdate(changedProperties);
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

  private _updateDrawerStyles(): void {
    this.drawerLayout.updateStyles();
    this.drawer.updateStyles();
  }

  private _notifyLayoutResize(): void {
    this.drawerLayout.notifyResize();
    this.appHeaderLayout.notifyResize();
  }
}
