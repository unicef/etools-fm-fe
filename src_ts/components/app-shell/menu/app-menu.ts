/* eslint-disable lit/attribute-value-entities */
import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-ripple/paper-ripple.js';

import {navMenuStyles} from './styles/nav-menu-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {ROOT_PATH, SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../../config/config';
import {CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {hasPermission, Permissions} from '../../../config/permissions';
import {store} from '../../../redux/store';
import {currentUser} from '../../../redux/selectors/user.selectors';
import {Unsubscribe} from 'redux';
import {translate} from 'lit-translate';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {apIcons} from '../../styles/app-icons';
import {connect} from 'pwa-helpers/connect-mixin.js';
import {get as getTranslation} from 'lit-translate';

/**
 * main menu
 * @LitElement
 * @customElement
 */
@customElement('app-menu')
export class AppMenu extends connect(store)(MatomoMixin(LitElement)) {
  @property({type: String, attribute: 'selected-option'})
  selectedOption = '';

  @property({type: String})
  rootPath: string = ROOT_PATH;

  @property({type: Boolean, attribute: 'small-menu'})
  smallMenu = false;

  @property() selectedLanguage!: string;

  private userUnsubscribe!: Unsubscribe;
  private userLoaded = false;

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      ${apIcons}

      <div class="menu-header">
        <span id="app-name" class="app-name">
          ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TITLE', 'Field Monitoring')}
        </span>

        <span class="ripple-wrapper main">
          <iron-icon
            id="menu-header-top-icon"
            icon="assignment-ind"
            @tap="${() => this._toggleSmallMenu()}"
          ></iron-icon>
          <paper-ripple class="circle" center></paper-ripple>
        </span>

        <paper-tooltip for="menu-header-top-icon" position="right">
          ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TITLE', 'Field Monitoring')}
        </paper-tooltip>

        <span class="chev-right">
          <iron-icon id="expand-menu" icon="chevron-right" @tap="${() => this._toggleSmallMenu()}"></iron-icon>
          <paper-ripple class="circle" center></paper-ripple>
        </span>

        <span class="ripple-wrapper">
          <iron-icon id="minimize-menu" icon="chevron-left" @tap="${() => this._toggleSmallMenu()}"></iron-icon>
          <paper-ripple class="circle" center></paper-ripple>
        </span>
      </div>

      <div class="nav-menu">
        <iron-selector
          .selected="${this.selectedOption}"
          attr-for-selected="menu-name"
          selectable="a"
          role="navigation"
        >
          <!-- Sidebar item - DATA VISITS -->
          <a
            class="nav-menu-item"
            menu-name="activities"
            href="${this.rootPath + 'activities'}"
            @tap="${this.trackAnalytics}"
            tracker="Visits"
          >
            <iron-icon id="page1-icon" icon="assignment"></iron-icon>
            <paper-tooltip for="page1-icon" position="right">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.VISITS', 'Visits')}
            </paper-tooltip>
            <div class="name">${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.VISITS', 'Visits')}</div>
          </a>

          <!-- Sidebar item - ANALYSIS -->
          <a
            class="nav-menu-item"
            menu-name="analyze"
            href="${this.rootPath + 'analyze/monitoring-activity'}"
            ?hidden="${!this.userLoaded || !hasPermission(Permissions.VIEW_ANALYZE)}"
            @tap="${this.trackAnalytics}"
            tracker="Analysis"
          >
            <iron-icon id="page2-icon" icon="av:equalizer"></iron-icon>
            <paper-tooltip for="page2-icon" position="right">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.ANALYSIS', 'Analysis')}
            </paper-tooltip>
            <div class="name">${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.ANALYSIS', 'Analysis')}</div>
          </a>

          <!-- Sidebar item - TEMPLATES -->
          <a
            class="nav-menu-item"
            menu-name="templates"
            href="${this.rootPath + 'templates/questions?page=1&page_size=10'}"
            ?hidden="${!this.userLoaded || !hasPermission(Permissions.VIEW_SETTINGS)}"
            @tap="${this.trackAnalytics}"
            tracker="Templates"
          >
            <iron-icon id="page3-icon" icon="icons:settings-applications"></iron-icon>
            <paper-tooltip for="page3-icon" position="right">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TEMPLATES', 'Templates')}
            </paper-tooltip>
            <div class="name">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TEMPLATES', 'Templates')}
            </div>
          </a>

          <!-- Sidebar item - PLANING -->
          <a
            class="nav-menu-item"
            menu-name="management"
            href="${this.rootPath + 'management/rationale?year=' + new Date().getFullYear()}"
            ?hidden="${!this.userLoaded || !hasPermission(Permissions.VIEW_PLANING)}"
            @tap="${this.trackAnalytics}"
            tracker="Management"
          >
            <iron-icon id="page4-icon" icon="av:playlist-add-check"></iron-icon>
            <paper-tooltip for="page4-icon" position="right">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.MANAGEMENT', 'Management')}
            </paper-tooltip>
            <div class="name">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.MANAGEMENT', 'Management')}
            </div>
          </a>

          <!-- Sidebar item - TPM -->
          <a
            class="nav-menu-item"
            menu-name="partners"
            href="${this.rootPath + 'partners'}"
            @tap="${this.trackAnalytics}"
            tracker="TPM"
          >
            <iron-icon id="page5-icon" icon="social:people"></iron-icon>
            <paper-tooltip for="page5-icon" position="right">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TPM', 'Third Party Monitors')}
            </paper-tooltip>
            <div class="name">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TPM', 'Third Party Monitors')}
            </div>
          </a>
        </iron-selector>

        <div class="nav-menu-item section-title">
          <span>${translate('NAVIGATION_MENU.COMMUNITY_CHANNELS')}</span>
        </div>

        <a
          class="nav-menu-item lighter-item"
          href="https://app.powerbi.com/groups/me/apps/2c83563f-d6fc-4ade-9c10-bbca57ed1ece/reports/9726e9e7-c72f-4153-9fd2-7b418a1e426c/ReportSection?ctid=77410195-14e1-4fb8-904b-ab1892023667"
          target="_blank"
          @tap="${this.trackAnalytics}"
          tracker="Implementation Intelligence"
        >
          <iron-icon id="power-bi-icon" icon="ap-icons:power-bi"></iron-icon>
          <paper-tooltip for="power-bi-icon" position="right">
            ${this.translateKey(
              this.selectedLanguage,
              'NAVIGATION_MENU.IMPLEMENTATION_INTELLIGENCE',
              'Implementation Intelligence'
            )}
          </paper-tooltip>
          <div class="name">
            ${this.translateKey(
              this.selectedLanguage,
              'NAVIGATION_MENU.IMPLEMENTATION_INTELLIGENCE',
              'Implementation Intelligence'
            )}
          </div>
        </a>

        <a
          class="nav-menu-item lighter-item"
          href="http://etools.zendesk.com"
          target="_blank"
          @tap="${this.trackAnalytics}"
          tracker="Knowledge base"
        >
          <iron-icon id="knoledge-icon" icon="maps:local-library"></iron-icon>
          <paper-tooltip for="knoledge-icon" position="right">
            ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.KNOWLEDGE_BASE', 'Knowledge Base')}
          </paper-tooltip>
          <div class="name">
            ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.KNOWLEDGE_BASE', 'Knowledge Base')}
          </div>
        </a>

        <a
          class="nav-menu-item lighter-item"
          href="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560"
          target="_blank"
          @tap="${this.trackAnalytics}"
          tracker="Discussion"
        >
          <iron-icon id="discussion-icon" icon="icons:question-answer"></iron-icon>
          <paper-tooltip for="discussion-icon" position="right">
            ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.DISCUSSION', 'Discussion')}
          </paper-tooltip>
          <div class="name">
            ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.DISCUSSION', 'Discussion')}
          </div>
        </a>
        <a
          class="nav-menu-item lighter-item last-one"
          href="https://etools.unicef.org/landing"
          target="_blank"
          @tap="${this.trackAnalytics}"
          tracker="Information"
        >
          <iron-icon id="information-icon" icon="icons:info"></iron-icon>
          <paper-tooltip for="information-icon" position="right">
            ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.INFORMATION', 'Information')}
          </paper-tooltip>
          <div class="name">
            ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.INFORMATION', 'Information')}
          </div>
        </a>
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.userUnsubscribe = store.subscribe(
      currentUser((user: IEtoolsUserModel | null) => {
        this.userLoaded = Boolean(user);
        if (this.userLoaded) {
          this.requestUpdate();
        }
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.userUnsubscribe();
  }

  // necessary in order to show menu text before language is set and loaded (default text is in 'en')
  translateKey(lng: string, key: string, defaultText: string): string {
    return lng ? getTranslation(key) : defaultText;
  }

  _toggleSmallMenu(): void {
    this.smallMenu = !this.smallMenu;
    const localStorageVal: number = this.smallMenu ? 1 : 0;
    localStorage.setItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY, String(localStorageVal));
    fireEvent(this, 'toggle-small-menu', {value: this.smallMenu});
  }

  static get styles(): CSSResult {
    return navMenuStyles;
  }
}
