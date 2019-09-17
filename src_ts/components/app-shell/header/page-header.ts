import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-app-selector/etools-app-selector';
import '@unicef-polymer/etools-profile-dropdown/etools-profile-dropdown';
import '../../common/layout/support-btn';
import './countries-dropdown';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store';

import { isProductionServer, isStagingServer, ROOT_PATH } from '../../../config/config';
import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { UpdateDrawerState } from '../../../redux/actions/app';
import { pageHeaderStyles } from './page-header-styles';
import { isEmpty } from 'ramda';
import { fireEvent } from '../../utils/fire-custom-event';
import { updateCurrentUserData } from '../../../redux/effects/user.effects';
import { currentUser, userSelector } from '../../../redux/selectors/user.selectors';

/**
 * page header element
 * @LitElement
 * @customElement
 */
@customElement('page-header')
export class PageHeader extends connect(store)(LitElement) {

    @property({ type: Boolean })
    public isStaging: boolean = false;

    public rootPath: string = ROOT_PATH;

    @property({ type: String })
    public headerColor: string = 'var(--header-bg-color)';

    @property({ type: Object })
    public profile!: IEtoolsUserModel;

    @property({ type: Object })
    public profileDropdownData: any | null = null;

    @property({ type: Array })
    public offices: any[] = [];

    @property({ type: Array })
    public sections: any[] = [];

    @property({ type: Array })
    public users: any[] = [];

    @property({ type: Array })
    public profileDrOffices: any[] = [];

    @property({ type: Array })
    public profileDrSections: any[] = [];

    @property({ type: Array })
    public profileDrUsers: any[] = [];

    @property({ type: Array })
    public editableFields: string[] = ['office', 'section', 'job_title', 'phone_number', 'oic', 'supervisor'];

    public constructor() {
        super();
        store.subscribe(currentUser((userDataState: IEtoolsUserModel | null) => {
            if (!userDataState) {
                this.showSaveNotification();
            }
        }));
        store.subscribe(userSelector((userState: IUserState) => {
            if (userState.error && !isEmpty(userState.error)) {
                this.showSaveNotification('Profile data not saved. Save profile error!');
            }
            if (!userState.isRequest && !userState.error) {
                this.profileSaveLoadingMsgDisplay(false);
            }
        }));
    }

    public render(): TemplateResult {
        // main template
        // language=HTML
        return html`
          ${pageHeaderStyles}
          <style>
            app-toolbar {
              background-color: ${this.headerColor};
            }
          </style>

          <app-toolbar sticky class="content-align">
            <paper-icon-button id="menuButton" icon="menu" @tap="${() => this.menuBtnClicked()}"></paper-icon-button>
            <div class="titlebar content-align">
              <etools-app-selector id="selector"></etools-app-selector>
              <img id="app-logo" src="${this.rootPath}images/etools-logo-color-white.svg" alt="eTools">
              ${this.isStaging ? html`<div class="envWarning"> - STAGING TESTING ENVIRONMENT</div>` : ''}
            </div>
            <div class="content-align">
              <countries-dropdown></countries-dropdown>

              <support-btn></support-btn>

              <etools-profile-dropdown
                  .sections="${this.profileDrSections}"
                  .offices="${this.profileDrOffices}"
                  .users="${this.profileDrUsers}"
                  .profile="${ this.profile ? { ...this.profile } : {} }"
                  @save-profile="${this.handleSaveProfile}"
                  @sign-out="${this._signOut}">
              </etools-profile-dropdown>

            </div>
          </app-toolbar>
    `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setBgColor();
        this.isStaging = isStagingServer();
    }

    public stateChanged(state: IRootState): void {
        if (state) {
            this.profile = state.user!.data as IEtoolsUserModel;
        }
    }

    public handleSaveProfile(e: any): void {
        const modifiedFields: GenericObject = this._getModifiedFields(this.profile, e.detail.profile);
        if (isEmpty(modifiedFields)) {
            // empty profile means no changes found
            this.showSaveNotification();
            return;
        }
        this.profileSaveLoadingMsgDisplay();
        store.dispatch<AsyncEffect>(updateCurrentUserData(modifiedFields));
    }

    public menuBtnClicked(): void {
        store.dispatch(new UpdateDrawerState(true));
        // fireEvent(this, 'drawer');
    }

    protected profileSaveLoadingMsgDisplay(show: boolean = true): void {
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
