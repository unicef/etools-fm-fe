import '@polymer/polymer/lib/elements/dom-if';
import '@polymer/iron-flex-layout/iron-flex-layout';
import '@polymer/app-layout/app-toolbar/app-toolbar';
import '@polymer/paper-icon-button/paper-icon-button';
import '@unicef-polymer/etools-app-selector/etools-app-selector';
import '../../common/layout/support-btn';

import { connect } from 'pwa-helpers/connect-mixin.js';
import { store } from '../../../redux/store';

import { isProductionServer, isStagingServer, ROOT_PATH } from '../../../config/config';
import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { UpdateDrawerState } from '../../../redux/actions/app';

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
    public headerColor: string = 'var(--header-bg-color)';

    public render(): TemplateResult {
        // main template
        // language=HTML
        return html`
          <style>
            app-toolbar {
              padding: 0 16px 0 0;
              height: 60px;
              background-color: ${this.headerColor};
            }

            .titlebar {
              color: var(--header-color);
            }

            #menuButton {
              display: block;
              color: var(--header-color);
            }

            support-btn{
              color: var(--header-color);
            }

            .titlebar {
              @apply --layout-flex;
              font-size: 28px;
              font-weight: 300;
            }

            .titlebar img {
              width: 34px;
              margin: 0 8px 0 24px;
            }

            .content-align {
              @apply --layout-horizontal;
              @apply --layout-center;
            }

            #app-logo {
              height: 32px;
              width: auto;
            }

            .envWarning {
              color: var(--nonprod-text-warn-color);
              font-weight: 700;
              font-size: 18px;
            }

            @media (min-width: 850px) {
              #menuButton {
                display: none;
              }
            }
          </style>

          <app-toolbar sticky class="content-align">
            <paper-icon-button id="menuButton" icon="menu" @tap="${() => this.menuBtnClicked()}"></paper-icon-button>
            <div class="titlebar content-align">
              <etools-app-selector id="selector"></etools-app-selector>
              <img id="app-logo" src="${this.rootPath}images/etools-logo-color-white.svg">
              ${this.isStaging ? html`<div class="envWarning"> - STAGING TESTING ENVIRONMENT</div>` : ''}
            </div>
            <div class="content-align">
              <!--<countries-dropdown id="countries" countries="[[countries]]"-->
                                  <!--current-country="[[profile.country]]"></countries-dropdown>-->

              <support-btn></support-btn>

              <!--<etools-profile-dropdown-->
                  <!--sections="[[allSections]]"-->
                  <!--offices="[[allOffices]]"-->
                  <!--users="[[allUsers]]"-->
                  <!--profile="{{profile}}"-->
                  <!--on-save-profile="_saveProfile"-->
                  <!--on-sign-out="_signOut"></etools-profile-dropdown>-->

              <!--<paper-icon-button id="refresh" icon="refresh" on-tap="_openDataRefreshDialog"></paper-icon-button>-->
            </div>
          </app-toolbar>
    `;
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.setBgColor();
        this.isStaging = isStagingServer();
    }

    public menuBtnClicked(): void {
        store.dispatch(new UpdateDrawerState(true));
        // fireEvent(this, 'drawer');
    }

    private setBgColor(): void {
        // If not production environment, changing header color to red
        if (!isProductionServer()) {
            this.headerColor = 'var(--nonprod-header-color)';
        }
    }
}
