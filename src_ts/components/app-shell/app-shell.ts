/**
@license
Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {setPassiveTouchGestures, setRootPath} from '@polymer/polymer/lib/utils/settings.js';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {installMediaQueryWatcher} from 'pwa-helpers/media-query.js';
import {installRouter} from 'pwa-helpers/router.js';

// This element is connected to the Redux store.
import {store, RootState} from '../../redux/store';

// These are the actions needed by this element.
import {
  navigate,
  // updateOffline,
  updateDrawerState
} from '../../redux/actions/app';

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

import {AppShellStyles} from './app-shell-styles';

import './menu/app-menu.js';
import './header/page-header.js';
import './footer/page-footer.js';

import './app-theme.js';
import {property} from '@polymer/decorators/lib/decorators';
import {AppMenuHelper} from './menu/app-menu-helper';
import {ToastNotificationHelper} from '../common/toast-notifications/toast-notification-helper';
import user from '../../redux/reducers/user';
import {ROOT_PATH} from '../../config/config';
import {getCurrentUserData} from '../user/user-actions';
import {EtoolsRouter} from "../../routing/routes";
import {TRouteDetails} from "../../routing/router";

setRootPath(ROOT_PATH);

store.addReducers({
  user
});

/**
 * @customElement
 * @polymer
 */
class AppShell extends connect(store)(PolymerElement) {

  public static get template() {
    // main template
    // language=HTML
    return html`
    ${AppShellStyles}
   
    <app-drawer-layout id="layout" responsive-width="850px"
                       fullbleed narrow="{{narrow}}" small-menu$="[[smallMenu]]">
      <!-- Drawer content -->
      <app-drawer id="drawer" slot="drawer" transition-duration="350" 
                  opened="[[_drawerOpened]]"
                  swipe-open="[[narrow]]" small-menu$="[[smallMenu]]">
        <!-- App main menu(left sidebar) -->
        <app-menu selected-option="[[_mainPage]]"
                  small-menu$="[[smallMenu]]"></app-menu>
      </app-drawer>

      <!-- Main content -->
      <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>

        <app-header slot="header" fixed shadow>
          <page-header id="pageheader" title="eTools"></page-header>
        </app-header>

        <!-- Main content -->
        <main role="main" class="main-content">
          <engagements-list class="page" 
              active$="[[_isActivePage(_mainPage, 'engagements', _subPage, 'list')]]"></engagements-list>
          <engagement-tabs class="page" 
              active$="[[_isActivePage(_mainPage, 'engagements', _subPage, 'details|questionnaires')]]"></engagement-tabs>
          <page-two class="page" active$="[[_isActivePage(_mainPage, 'page-two')]]"></page-two>
          <page-not-found class="page" active$="[[_isActivePage(_mainPage, 'page-not-found')]]"></page-not-found>
        </main>

        <page-footer></page-footer>

      </app-header-layout>
    </app-drawer-layout>
    `;
  }

  @property({type: Boolean})
  _drawerOpened: boolean = false;

  @property({type: Object})
  _routeDetails: TRouteDetails = {} as TRouteDetails;

  @property({type: String})
  _mainPage: string = ''; // routeName

  @property({type: String})
  _subPage: string | null = null; // subRouteName

  @property({type: Boolean})
  smallMenu: boolean = false;

  private appMenuHelper = {} as AppMenuHelper;
  private appToastsNotificationsHelper = {} as ToastNotificationHelper;

  constructor() {
    super();
    // Gesture events like tap and track generated from touch will not be
    // preventable, allowing for better scrolling performance.
    setPassiveTouchGestures(true);
    // init toasts notifications queue
    this.appToastsNotificationsHelper = new ToastNotificationHelper(this as PolymerElement);
    this.appToastsNotificationsHelper.addToastNotificationListeners();
  }

  public connectedCallback() {
    super.connectedCallback();
    // init app menu helper object and set small menu event listeners
    this.appMenuHelper = new AppMenuHelper(this as PolymerElement);
    this.appMenuHelper.initMenuListeners();
    this.appMenuHelper.initMenuSize();

    installRouter(location => store.dispatch(
        navigate(decodeURIComponent(location.pathname + location.search))));
    installMediaQueryWatcher(`(min-width: 460px)`,
      () => store.dispatch(updateDrawerState(false)));

    // TODO: just testing...
    getCurrentUserData();
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    // use app menu helper object and remove small menu event listeners
    this.appMenuHelper.removeMenuListeners();
    // remove toasts notifications listeners
    this.appToastsNotificationsHelper.removeToastNotificationListeners();
  }

  public stateChanged(state: RootState) {
    this._routeDetails = state.app!.routeDetails;
    this._mainPage = state.app!.routeDetails!.routeName;
    this._subPage = state.app!.routeDetails!.subRouteName;
    this._drawerOpened = state.app!.drawerOpened;
  }

  // TODO: just for testing...
  public getState() {
    console.log(store.getState());
  }

  // Testing router (from console)
  public getRouter() {
    return EtoolsRouter;
  }

  protected _isActivePage(pageName: string, expectedPageName: string,
                          currentSubPageName: string, expectedSubPageNames?: string): boolean {
    if (pageName !== expectedPageName) {
      return false;
    }
    if (currentSubPageName && expectedSubPageNames) {
      const subPages: string[] = expectedSubPageNames.split('|');
      return subPages.indexOf(currentSubPageName) > -1;
    }
    return true;
  }
}

window.customElements.define('app-shell', AppShell);
