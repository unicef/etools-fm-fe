import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';

class EngagementQuestionnaires extends PolymerElement {

  // Define optional shadow DOM template
  static get template() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      Questionnaires tab content...
    `;
  }

  static get properties() {
    return {}
  }

  constructor() {
    super();
  }

  connectedCallback() {
    super.connectedCallback()
  }

  disconnectedCallback() {
    super.disconnectedCallback();
  }

}

window.customElements.define('engagement-questionnaires', EngagementQuestionnaires);
