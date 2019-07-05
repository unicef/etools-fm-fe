import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import '@polymer/paper-styles/element-styles/paper-material-styles.js';
import '@polymer/paper-button/paper-button';

import {SharedStyles} from '../styles/shared-styles.js';
import '../layout/page-content-header';
import {property} from '@polymer/decorators';
import '../layout/etools-tabs';
import {fireEvent} from "../utils/fire-custom-event";


/**
 * @polymer
 * @customElement
 */
class PageOne extends PolymerElement {

  public static get template() {
    // main template
    // language=HTML
    return html`
      <style include="paper-material-styles">
        #page-content {
          margin: 24px;
        }
      </style>
      ${SharedStyles}

      <page-content-header with-tabs-visible>
        <div slot="page-title">
          Page title
        </div>

        <div slot="title-row-actions" class="content-header-actions export-options">
          <paper-button raised>Action</paper-button>
        </div>

        <etools-tabs slot="tabs"
                      tabs="[[pageTabs]]"
                      active-tab="tab1"
                      on-iron-select="_handleTabSelectAction"></etools-tabs>
      </page-content-header>

      <section id="page-content" class="paper-material" elevation="1">
        <h1>Page 1</h1>
        <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
        Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took
        a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries,
        but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the
        1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
        publishing software like Aldus PageMaker including versions of Lorem Ipsum.
        </p>
      </section>
    `;
  }

 @property({type: Array})
 pageTabs = [
    {
      tab: 'tab1',
      tabLabel: 'Tab1',
      hidden: false

    },
    {
      tab: 'tab2',
      tabLabel: 'Tab2',
      hidden: false

    }
  ];

  connectedCallback(): void {
    super.connectedCallback();
    fireEvent(this, 'toast', {text: 'Page one loaded', showCloseBtn: false});
    fireEvent(this, 'toast', {text: 'Notification test 1', showCloseBtn: true});
    fireEvent(this, 'toast', {text: 'Notification test 2', showCloseBtn: true});
  }

}

window.customElements.define('page-one', PageOne);
