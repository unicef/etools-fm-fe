import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-icons/av-icons.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-ripple/paper-ripple.js';

import {navMenuStyles} from './styles/nav-menu-styles';
import {fireEvent} from '../../utils/fire-custom-event';
import {ROOT_PATH, SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../../config/config';
import {CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import {hasPermission, Permissions} from '../../../config/permissions';
import {store} from '../../../redux/store';
import {currentUser} from '../../../redux/selectors/user.selectors';
import {Unsubscribe} from 'redux';
import {translate} from 'lit-translate';

/**
 * main menu
 * @LitElement
 * @customElement
 */
@customElement('app-menu')
export class AppMenu extends LitElement {
  @property({type: String, attribute: 'selected-option'})
  selectedOption = '';

  @property({type: String})
  rootPath: string = ROOT_PATH;

  @property({type: Boolean, attribute: 'small-menu'})
  smallMenu = false;

  private userUnsubscribe!: Unsubscribe;
  private userLoaded = false;

  render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      <div class="menu-header">
        <span id="app-name" class="app-name"> ${translate('NAVIGATION_MENU.TITLE')} </span>

        <span class="ripple-wrapper main">
          <iron-icon
            id="menu-header-top-icon"
            icon="assignment-ind"
            @tap="${() => this._toggleSmallMenu()}"
          ></iron-icon>
          <paper-ripple class="circle" center></paper-ripple>
        </span>

        <paper-tooltip for="menu-header-top-icon" position="right">
          ${translate('NAVIGATION_MENU.TITLE')}
        </paper-tooltip>

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
          <a class="nav-menu-item" menu-name="activities" href="${this.rootPath + 'activities'}">
            <iron-icon id="page1-icon" icon="assignment"></iron-icon>
            <paper-tooltip for="page1-icon" position="right"> ${translate('NAVIGATION_MENU.VISITS')} </paper-tooltip>
            <div class="name">${translate('NAVIGATION_MENU.VISITS')}</div>
          </a>

          <!-- Sidebar item - ANALYSIS -->
          <a
            class="nav-menu-item"
            menu-name="analyze"
            href="${this.rootPath + 'analyze'}"
            ?hidden="${!this.userLoaded || !hasPermission(Permissions.VIEW_ANALYZE)}"
          >
            <iron-icon id="page1-icon" icon="av:equalizer"></iron-icon>
            <paper-tooltip for="page1-icon" position="right"> ${translate('NAVIGATION_MENU.ANALYSIS')} </paper-tooltip>
            <div class="name">${translate('NAVIGATION_MENU.ANALYSIS')}</div>
          </a>

          <!-- Sidebar item - TEMPLATES -->
          <a
            class="nav-menu-item"
            menu-name="templates"
            href="${this.rootPath + 'templates'}"
            ?hidden="${!this.userLoaded || !hasPermission(Permissions.VIEW_SETTINGS)}"
          >
            <iron-icon id="page1-icon" icon="icons:settings-applications"></iron-icon>
            <paper-tooltip for="page1-icon" position="right"> ${translate('NAVIGATION_MENU.TEMPLATES')} </paper-tooltip>
            <div class="name">${translate('NAVIGATION_MENU.TEMPLATES')}</div>
          </a>

          <!-- Sidebar item - PLANING -->
          <a
            class="nav-menu-item"
            menu-name="plan"
            href="${this.rootPath + 'plan'}"
            ?hidden="${!this.userLoaded || !hasPermission(Permissions.VIEW_PLANING)}"
          >
            <iron-icon id="page1-icon" icon="av:playlist-add-check"></iron-icon>
            <paper-tooltip for="page1-icon" position="right">
              ${translate('NAVIGATION_MENU.MANAGEMENT')}
            </paper-tooltip>
            <div class="name">${translate('NAVIGATION_MENU.MANAGEMENT')}</div>
          </a>
        </iron-selector>

        <div class="nav-menu-item section-title">
          <span>${translate('NAVIGATION_MENU.COMMUNITY_CHANNELS')}</span>
        </div>

        <a class="nav-menu-item lighter-item" href="http://etools.zendesk.com" target="_blank">
          <iron-icon id="knoledge-icon" icon="maps:local-library"></iron-icon>
          <paper-tooltip for="knoledge-icon" position="right">
            ${translate('NAVIGATION_MENU.KNOWLEDGE_BASE')}
          </paper-tooltip>
          <div class="name">${translate('NAVIGATION_MENU.KNOWLEDGE_BASE')}</div>
        </a>

        <a
          class="nav-menu-item lighter-item"
          href="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560"
          target="_blank"
        >
          <iron-icon id="discussion-icon" icon="icons:question-answer"></iron-icon>
          <paper-tooltip for="discussion-icon" position="right">
            ${translate('NAVIGATION_MENU.DISCUSSION')}
          </paper-tooltip>
          <div class="name">${translate('NAVIGATION_MENU.DISCUSSION')}</div>
        </a>

        <a class="nav-menu-item lighter-item last-one" href="http://etoolsinfo.unicef.org" target="_blank">
          <iron-icon id="information-icon" icon="icons:info"></iron-icon>
          <paper-tooltip for="information-icon" position="right">
            ${translate('NAVIGATION_MENU.INFORMATION')}
          </paper-tooltip>
          <div class="name">${translate('NAVIGATION_MENU.INFORMATION')}</div>
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
