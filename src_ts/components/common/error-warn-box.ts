import {LitElement, TemplateResult, html, customElement, property} from 'lit-element';
import '@unicef-polymer/etools-content-panel/etools-content-panel';
import '@polymer/paper-button/paper-button.js';

/**
 * @LitElement
 * @customElement
 */

@customElement('etools-error-warn-box')
export class EtoolsErrorWarnBox extends LitElement {
  @property({type: String})
  alertType = 'warning';

  @property({type: String})
  title = 'Error messages';

  @property({type: Array})
  messages: string[] = [];

  render(): TemplateResult {
    // language=HTML

    if (this.messages.length === 0) {
      this.setAttribute('hidden', '');
    } else {
      this.removeAttribute('hidden');
    }

    return html`
      <style>
        :host {
          width: 100%;
          --warning-background-color: #fff3cd;
          --warning-color: #856404;
          --warning-border-color: #ffeeba;

          --error-box-heading-color: var(--error-color);
          --error-box-bg-color: #f2dede;
          --error-box-border-color: #ebccd1;
          --error-box-text-color: var(--error-color);
          --error-color: #ea4022;
        }
        :host([hidden]) {
          display: none;
        }
        .warning-container {
          display: flex;
          flex-direction: column;
          flex: 1;
          padding: 16px 24px;
          background-color: var(--warning-background-color);
          color: var(--warning-color);
          border: 1px solid var(--warning-border-color);
        }
        .warning-item {
          display: flex;
        }
        etools-content-panel {
          width: 100%;
        }
        .errors-box {
          margin-bottom: 25px;
        }
        etools-content-panel::part(ecp-header) {
          background-color: var(--error-box-heading-color);
          color: var(---primary-background-color);
        }
        etools-content-panel::part(ecp-header-title) {
          text-align: center;
        }
        etools-content-panel::part(ecp-content) {
          color: var(--error-box-text-color);
          background-color: var(--error-box-bg-color);
          border: 1px solid var(--error-box-border-color);
        }
        ul {
          padding: 0 0 0 20px;
          margin: 0;
          padding-inline-start: 0;
        }
        .errors-box-actions {
          margin-top: 20px;
          display: flex;
          justify-content: flex-end;
        }
        paper-button {
          margin: 0;
        }
        .cancel-li-display {
          display: block;
        }
      </style>
      ${this.getHTML()}
    `;
  }

  getHTML(): TemplateResult {
    if (this.alertType === 'error') {
      return html`
        <etools-content-panel class="errors-box" panel-title="${this.title}">
          <ul>
            ${this.messages.map((msg: string) => this.getErrorHTML(msg))}
          </ul>
          <div class="errors-box-actions">
            <paper-button raised class="error" @tap="${this.resetErrors}"> Dismiss </paper-button>
          </div>
        </etools-content-panel>
      `;
    } else {
      return html`
        <div class="warning-container">${this.messages.map((msg: string) => this.getWarningHTML(msg))}</div>
      `;
    }
  }

  getWarningHTML(msg: string): TemplateResult {
    return html` <div class="warning-item">${msg}</div> `;
  }

  getErrorHTML(msg: string): TemplateResult {
    return html` <li class="cancel-li-display">${msg}</li> `;
  }

  resetErrors(): void {
    this.messages = [];
  }
}
