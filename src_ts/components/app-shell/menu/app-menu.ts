import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@shoelace-style/shoelace/dist/components/tooltip/tooltip.js';

import {navMenuStyles} from './styles/nav-menu-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../../config/config';

import {CSSResult, html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';

import {hasPermission, Permissions} from '../../../config/permissions';
import {store} from '../../../redux/store';
import {currentUser} from '../../../redux/selectors/user.selectors';
import {Unsubscribe} from 'redux';
import {translate, get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import {connect} from '@unicef-polymer/etools-utils/dist/pwa.utils';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';

/**
 * main menu
 * @LitElement
 * @customElement
 */
@customElement('app-menu')
export class AppMenu extends connect(store)(MatomoMixin(LitElement)) {
  @property({type: String, attribute: 'selected-option'})
  selectedOption = '';

  @property({type: Boolean, attribute: 'small-menu'})
  smallMenu = false;

  @property() selectedLanguage!: string;

  private userUnsubscribe!: Unsubscribe;
  private userLoaded = false;

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      <div class="menu-header">
        <span id="app-name" class="app-name">
          ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TITLE', 'Field Monitoring')}
        </span>

        <span class="ripple-wrapper main"> </span>

        <sl-tooltip
          content="${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TITLE', 'Field Monitoring')}"
          for="menu-header-top-icon"
          placement="right"
          ?disabled="${!this.smallMenu}"
        >
          <etools-icon
            id="menu-header-top-icon"
            name="assignment-ind"
            @click="${() => this._toggleSmallMenu()}"
          ></etools-icon>
        </sl-tooltip>

        <span class="chev-right">
          <etools-icon id="expand-menu" name="chevron-right" @click="${() => this._toggleSmallMenu()}"></etools-icon>
        </span>

        <span class="ripple-wrapper">
          <etools-icon id="minimize-menu" name="chevron-left" @click="${() => this._toggleSmallMenu()}"></etools-icon>
        </span>
      </div>

      <div class="nav-menu">
        <div
          class="menu-selector"
          role="navigation"
          .selected="${this.selectedOption}"
          attr-for-selected="menu-name"
          selectable="a"
        >
          <!-- Sidebar item - DATA VISITS -->
          <a
            class="nav-menu-item ${this.getItemClass(this.selectedOption, 'activities-and-data-collection')}"
            menu-name="activities-and-data-collection"
            href="${Environment.basePath + 'activities'}"
            @click="${this.trackAnalytics}"
            tracker="Visits"
          >
            <sl-tooltip
              for="page1-icon"
              placement="right"
              ?disabled="${!this.smallMenu}"
              content="${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.VISITS', 'Visits')}"
            >
              <etools-icon id="page1-icon" name="assignment"></etools-icon>
            </sl-tooltip>
            <div class="name">${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.VISITS', 'Visits')}</div>
          </a>

          <!-- Sidebar item - ANALYSIS -->
          <a
            class="nav-menu-item  ${this.getItemClass(this.selectedOption, 'analyze')}"
            menu-name="analyze"
            href="${Environment.basePath + 'analyze/country-overview'}"
            ?hidden="${!this.userLoaded || !hasPermission(Permissions.VIEW_ANALYZE)}"
            @click="${this.trackAnalytics}"
            tracker="Analysis"
          >
            <sl-tooltip
              for="page2-icon"
              placement="right"
              ?disabled="${!this.smallMenu}"
              content=" ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.ANALYSIS', 'Analysis')}"
            >
              <etools-icon id="page2-icon" name="av:equalizer"></etools-icon>
            </sl-tooltip>
            <div class="name">${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.ANALYSIS', 'Analysis')}</div>
          </a>

          <!-- Sidebar item - TEMPLATES -->
          <a
            class="nav-menu-item  ${this.getItemClass(this.selectedOption, 'templates')}"
            menu-name="templates"
            href="${Environment.basePath + 'templates/questions'}"
            ?hidden="${!this.userLoaded || !hasPermission(Permissions.VIEW_SETTINGS)}"
            @click="${this.trackAnalytics}"
            tracker="Templates"
          >
            <sl-tooltip
              for="page3-icon"
              placement="right"
              ?disabled="${!this.smallMenu}"
              content="${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TEMPLATES', 'Templates')}"
            >
              <etools-icon id="page3-icon" name="settings-applications"></etools-icon>
            </sl-tooltip>
            <div class="name">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TEMPLATES', 'Templates')}
            </div>
          </a>

          <!-- Sidebar item - PLANING -->
          <a
            class="nav-menu-item  ${this.getItemClass(this.selectedOption, 'management')}"
            menu-name="management"
            href="${Environment.basePath + 'management/rationale?year=' + new Date().getFullYear()}"
            ?hidden="${!this.userLoaded || !hasPermission(Permissions.VIEW_PLANING)}"
            @click="${this.trackAnalytics}"
            tracker="Management"
          >
            <sl-tooltip
              for="page4-icon"
              placement="right"
              ?disabled="${!this.smallMenu}"
              content="${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.MANAGEMENT', 'Management')}"
            >
              <etools-icon id="page4-icon" name="av:playlist-add-check"></etools-icon>
            </sl-tooltip>
            <div class="name">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.MANAGEMENT', 'Management')}
            </div>
          </a>

          <!-- Sidebar item - TPM -->
          <a
            class="nav-menu-item ${this.getItemClass(this.selectedOption, 'partners')}"
            menu-name="partners"
            href="${Environment.basePath + 'partners'}"
            @click="${this.trackAnalytics}"
            tracker="TPM"
          >
            <sl-tooltip
              for="page5-icon"
              placement="right"
              ?disabled="${!this.smallMenu}"
              content="${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TPM', 'Third Party Monitors')}"
            >
              <etools-icon id="page5-icon" name="social:people"></etools-icon>
            </sl-tooltip>
            <div class="name">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.TPM', 'Third Party Monitors')}
            </div>
          </a>

          <!-- Sidebar item - Dashboard -->
          <a
            class="nav-menu-item ${this.getItemClass(this.selectedOption, 'dashboard')}"
            menu-name="dashboard"
            href="/dash/fmp"
            @click="${this.trackAnalytics}"
            target="_blank"
            tracker="DASH"
          >
            <sl-tooltip
              for="dash-icon"
              placement="right"
              ?disabled="${!this.smallMenu}"
              content="${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.DASHBOARD', 'Dashboard')}"
            >
              <etools-icon id="dash-icon" name="dashboard"></etools-icon>
            </sl-tooltip>
            <div class="name">
              ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.DASHBOARD', 'Dashboard')}
            </div>
          </a>
        </div>

        <div class="nav-menu-item section-title">
          <span>${translate('NAVIGATION_MENU.COMMUNITY_CHANNELS')}</span>
        </div>

        <a
          class="nav-menu-item lighter-item"
          href="http://etools.zendesk.com"
          target="_blank"
          @click="${this.trackAnalytics}"
          tracker="Knowledge base"
        >
          <sl-tooltip
            for="knoledge-icon"
            placement="right"
            ?disabled="${!this.smallMenu}"
            content="${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.KNOWLEDGE_BASE', 'Knowledge Base')}"
          >
            <etools-icon id="knoledge-icon" name="maps:local-library"></etools-icon>
          </sl-tooltip>
          <div class="name">
            ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.KNOWLEDGE_BASE', 'Knowledge Base')}
          </div>
        </a>

        <a
          class="nav-menu-item lighter-item"
          href="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560"
          target="_blank"
          @click="${this.trackAnalytics}"
          tracker="Discussion"
        >
          <sl-tooltip
            for="discussion-icon"
            placement="right"
            ?disabled="${!this.smallMenu}"
            content="${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.DISCUSSION', 'Discussion')}"
          >
            <etools-icon id="discussion-icon" name="question-answer"></etools-icon>
          </sl-tooltip>
          <div class="name">
            ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.DISCUSSION', 'Discussion')}
          </div>
        </a>
        <a
          class="nav-menu-item lighter-item last-one"
          href="https://etools.unicef.org/landing"
          target="_blank"
          @click="${this.trackAnalytics}"
          tracker="Information"
        >
          <sl-tooltip
            for="information-icon"
            placement="right"
            ?disabled="${!this.smallMenu}"
            content="${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.INFORMATION', 'Information')}"
          >
            <etools-icon id="information-icon" name="info"></etools-icon>
          </sl-tooltip>
          <div class="name">
            eTools ${this.translateKey(this.selectedLanguage, 'NAVIGATION_MENU.INFORMATION', 'Information')}
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

  getItemClass(selectedValue: string, itemValue: string) {
    return selectedValue === itemValue ? 'selected' : '';
  }

  static get styles(): CSSResult {
    return navMenuStyles;
  }
}
