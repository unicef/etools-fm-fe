/**
 @license
 Copyright (c) 2018 The Polymer Project Authors. All rights reserved.
 This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 Code distributed by Google as part of the polymer project is also
 subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
import { setPassiveTouchGestures, setRootPath } from '@polymer/polymer/lib/utils/settings.js';
import { connect } from 'pwa-helpers/connect-mixin.js';
import { installMediaQueryWatcher } from 'pwa-helpers/media-query.js';
import { installRouter } from 'pwa-helpers/router.js';

// This element is connected to the Redux store.
import { store } from '../../redux/store';

// These are the actions needed by this element.

// These are the elements needed by this element.
import '@polymer/app-layout/app-drawer-layout/app-drawer-layout.js';
import '@polymer/app-layout/app-drawer/app-drawer.js';
import '@polymer/app-layout/app-header-layout/app-header-layout.js';
import '@polymer/app-layout/app-header/app-header.js';
import '@polymer/app-layout/app-toolbar/app-toolbar.js';

import { AppShellStyles } from './app-shell-styles';

import './menu/app-menu.js';
import './header/page-header.js';
import './footer/page-footer.js';

import './app-theme.js';
import { ToastNotificationHelper } from '../common/toast-notifications/toast-notification-helper';
import { ROOT_PATH, SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY } from '../../config/config';
import { getCurrentUserData } from '../../redux/effects/user.effects';
import { AppDrawerLayoutElement } from '@polymer/app-layout/app-drawer-layout/app-drawer-layout';
import { AppHeaderLayoutElement } from '@polymer/app-layout/app-header-layout/app-header-layout';
import { AppDrawerElement } from '@polymer/app-layout/app-drawer/app-drawer';
import { customElement, html, LitElement, property, query, TemplateResult } from 'lit-element';
import { navigate } from '../../redux/effects/app.effects';
import { userData } from '../../redux/reducers/user';
import { UpdateDrawerState } from '../../redux/actions/app';

setRootPath(ROOT_PATH);

store.addReducers({
    userData
});

/**
 * @customElement
 * @LitElement
 */
@customElement('app-shell')
export class AppShell extends connect(store)(LitElement) {

    @property({ type: Boolean })
    public narrow: boolean = true;

    @property({ type: Boolean })
    public drawerOpened: boolean = false;

    @property({ type: Object })
    public routeDetails!: IRouteDetails;

    @property({ type: String })
    public mainPage: string = ''; // routeName

    @property({ type: String })
    public subPage: string | null = null; // subRouteName

    @property({ type: Boolean })
    public smallMenu: boolean = false;

    @query('#layout') private drawerLayout!: AppDrawerLayoutElement;
    @query('#drawer') private drawer!: AppDrawerElement;
    @query('#appHeadLayout') private appHeaderLayout!: AppHeaderLayoutElement;

    private appToastsNotificationsHelper!: ToastNotificationHelper;

    public constructor() {
        super();
        // Gesture events like tap and track generated from touch will not be
        // preventable, allowing for better scrolling performance.
        setPassiveTouchGestures(true);
        // init toasts notifications queue
        this.appToastsNotificationsHelper = new ToastNotificationHelper(this);
        this.appToastsNotificationsHelper.addToastNotificationListeners();

        const menuTypeStoredVal: string | null = localStorage.getItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY);
        if (!menuTypeStoredVal) {
            this.smallMenu = false;
        } else {
            this.smallMenu = !!parseInt(menuTypeStoredVal, 10);
        }
    }

    public connectedCallback(): void {
        super.connectedCallback();

        installRouter((location: Location) => store.dispatch<AsyncEffect>(
            navigate(decodeURIComponent(location.pathname + location.search))));
        installMediaQueryWatcher(`(min-width: 460px)`,
            () => store.dispatch(new UpdateDrawerState(false)));

        // TODO: just testing...
        getCurrentUserData();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        // remove toasts notifications listeners
        this.appToastsNotificationsHelper.removeToastNotificationListeners();
    }

    public stateChanged(state: IRootState): void {
        this.routeDetails = state.app!.routeDetails;
        this.mainPage = state.app!.routeDetails!.routeName;
        this.subPage = state.app!.routeDetails!.subRouteName;
        this.drawerOpened = state.app!.drawerOpened;
    }

    public onDrawerToggle(): void {
        if (this.drawerOpened !== this.drawer.opened) {
            const newState: boolean = Boolean(this.drawer.opened);
            store.dispatch(new UpdateDrawerState(newState));
        }
    }

    public toggleMenu(e: CustomEvent): void {
        this.smallMenu = e.detail.value;
        this._updateDrawerStyles();
        this._notifyLayoutResize();
    }

    public render(): TemplateResult {
        // main template
        // language=HTML
        return html`
            ${AppShellStyles}

            <app-drawer-layout id="layout" responsive-width="850px"
                       fullbleed ?narrow="${this.narrow}" ?small-menu="${this.smallMenu}">
                <!-- Drawer content -->
                <app-drawer id="drawer" slot="drawer" transition-duration="350"
                          @app-drawer-transitioned="${this.onDrawerToggle}"
                          ?opened="${this.drawerOpened}"
                          ?swipe-open="${this.narrow}" ?small-menu="${this.smallMenu}">
                <!-- App main menu(left sidebar) -->
                <app-menu selected-option="${this.mainPage}"
                          @toggle-small-menu="${(e: CustomEvent) => this.toggleMenu(e)}"
                          ?small-menu="${this.smallMenu}"></app-menu>
            </app-drawer>

            <!-- Main content -->
                <app-header-layout id="appHeadLayout" fullbleed has-scrolling-region>

                    <app-header slot="header" fixed shadow>
                        <page-header id="pageheader" title="eTools"></page-header>
                    </app-header>

                    <!-- Main content -->
                    <main role="main" class="main-content">
                        <engagements-list class="page"
                          ?active="${this.isActivePage(this.mainPage, 'engagements', this.subPage, 'list')}">
                        </engagements-list>
                        <engagement-tabs class="page"
                          ?active="${this.isActivePage(this.mainPage, 'engagements', this.subPage, 'details|questionnaires')}">
                        </engagement-tabs>
                        <page-two class="page" ?active="${this.isActivePage(this.mainPage, 'page-two')}"></page-two>
                        <page-not-found class="page" ?active="${this.isActivePage(this.mainPage, 'page-not-found')}">
                        </page-not-found>
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
        return subPages.indexOf(currentSubPageName) > -1;
    }

    protected isActivePage(pageName: string, expectedPageName: string,
                           currentSubPageName?: string | null, expectedSubPageNames?: string): boolean {
        if (!this.isActiveMainPage(pageName, expectedPageName)) {
            return false;
        }
        if (currentSubPageName && expectedSubPageNames) {
            return this.isActiveSubPage(currentSubPageName, expectedSubPageNames);
        }
        return true;
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
