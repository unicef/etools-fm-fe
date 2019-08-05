import '@polymer/iron-icons/iron-icons.js';
import '@polymer/iron-icons/maps-icons.js';
import '@polymer/iron-selector/iron-selector.js';
import '@polymer/paper-tooltip/paper-tooltip.js';
import '@polymer/paper-ripple/paper-ripple.js';

import {navMenuStyles} from './styles/nav-menu-styles';
import {fireEvent} from '../../utils/fire-custom-event';
import {SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY} from '../../../config/config';
import {customElement, html, LitElement, property} from 'lit-element';

/**
 * main menu
 * @LitElement
 * @customElement
 */
@customElement('app-menu')
export class AppMenu extends LitElement {

  public render() {
    // main template
    // language=HTML
    return html`
        ${navMenuStyles}

      <div class="menu-header">
      <span id="app-name">
        Frontend <br>
        Template
      </span>

        <span class="ripple-wrapper main">
        <iron-icon id="menu-header-top-icon"
                   icon="assignment-ind"
                    @tap="${() => this._toggleSmallMenu()}"></iron-icon>
        <paper-ripple class="circle" center></paper-ripple>
      </span>

        <paper-tooltip for="menu-header-top-icon" position="right">
          Frontend Template
        </paper-tooltip>

        <span class="ripple-wrapper">
        <iron-icon id="minimize-menu"
                   icon="chevron-left"
                    @tap="${() => this._toggleSmallMenu()}"></iron-icon>
        <paper-ripple class="circle" center></paper-ripple>
      </span>
      </div>

      <div class="nav-menu">
        <iron-selector .selected="${this.selectedOption}"
                       attr-for-selected="menu-name"
                       selectable="a"
                       role="navigation">

          <a class="nav-menu-item" menu-name="engagements" href="${this.rootPath + 'engagements'}">
            <iron-icon id="page1-icon" icon="accessibility"></iron-icon>
            <paper-tooltip for="page1-icon" position="right">
              Engagements
            </paper-tooltip>
            <div class="name">Engagements</div>
          </a>

          <a class="nav-menu-item" menu-name="page-two" href="${this.rootPath + 'page-two'}">
            <iron-icon id="page2-icon" icon="extension"></iron-icon>
            <paper-tooltip for="page2-icon" position="right">
              Page Two
            </paper-tooltip>
            <div class="name">Page Two</div>
          </a>
          
        </iron-selector>

        <div class="nav-menu-item section-title">
          <span>eTools Community Channels</span>
        </div>

        <a class="nav-menu-item lighter-item" href="http://etools.zendesk.com" target="_blank">
          <iron-icon id="knoledge-icon" icon="maps:local-library"></iron-icon>
          <paper-tooltip for="knoledge-icon" position="right">
            Knowledge base
          </paper-tooltip>
          <div class="name">Knowledge base</div>
        </a>

        <a class="nav-menu-item lighter-item"
           href="https://www.yammer.com/unicef.org/#/threads/inGroup?type=in_group&feedId=5782560"
           target="_blank">
          <iron-icon id="discussion-icon" icon="icons:question-answer"></iron-icon>
          <paper-tooltip for="discussion-icon" position="right">
            Discussion
          </paper-tooltip>
          <div class="name">Discussion</div>
        </a>

        <a class="nav-menu-item lighter-item last-one" href="http://etoolsinfo.unicef.org" target="_blank">
          <iron-icon id="information-icon" icon="icons:info"></iron-icon>
          <paper-tooltip for="information-icon" position="right">
            Information
          </paper-tooltip>
          <div class="name">Information</div>
        </a>

      </div>
    `;
  }

  @property({type: String, attribute: 'selected-option'})
  public selectedOption: string = '';

  @property({type: String})
  public rootPath: string = '';

  @property({type: Boolean, attribute: 'small-menu'})
  public smallMenu: boolean = false;

  public _toggleSmallMenu(): void {
    this.smallMenu = !this.smallMenu;
    const localStorageVal: number = this.smallMenu ? 1 : 0;
    localStorage.setItem(SMALL_MENU_ACTIVE_LOCALSTORAGE_KEY, String(localStorageVal));
    fireEvent(this, 'toggle-small-menu', {value: this.smallMenu});
  }

}
