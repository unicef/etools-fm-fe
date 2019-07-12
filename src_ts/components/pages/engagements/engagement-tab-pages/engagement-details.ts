import {PolymerElement, html} from '@polymer/polymer/polymer-element';

/**
 * @customElement
 * @polymer
 */
class EngagementDetails extends PolymerElement {

  static get template() {
    // language=HTML
    return html`
      <style>
        /* CSS rules for your element */
      </style>

      PSEA engagement details here
    `;
  }

}

window.customElements.define('engagement-details', EngagementDetails);
