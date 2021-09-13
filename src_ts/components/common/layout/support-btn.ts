import {css, CSSResult, customElement, html, LitElement, TemplateResult} from 'lit-element';
import '@polymer/iron-icons/communication-icons';
import {translate} from 'lit-translate';

/* eslint-disable max-len */

/**
 * @LitElement
 * @customElement
 */
@customElement('support-btn')
export class SupportBtn extends LitElement {
  static get styles(): CSSResult {
    // language=CSS
    return css`
      :host(:hover) {
        cursor: pointer;
      }

      a {
        color: inherit;
        text-decoration: none;
        font-size: 16px;
      }

      iron-icon {
        margin-right: 4px;
      }

      @media (max-width: 650px) {
        .support-text {
          display: none;
        }
      }
    `;
  }

  render(): TemplateResult {
    // language=HTML
    return html`
      <a
        href="https://unicef.service-now.com/cc?id=sc_cat_item&sys_id=c8e43760db622450f65a2aea4b9619ad&sysparm_category=99c51053db0a6f40f65a2aea4b9619af"
        target="_blank"
      >
        <iron-icon icon="communication:textsms"></iron-icon>
        <span class="support-text">${translate('MAIN.SUPPORT')}</span>
      </a>
    `;
  }
}
