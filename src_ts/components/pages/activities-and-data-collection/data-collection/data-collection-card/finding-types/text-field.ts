import {html, customElement, TemplateResult} from 'lit-element';
import {BaseField} from './base-field';
import '@polymer/paper-input/paper-textarea';

@customElement('text-field')
export class TextField extends BaseField<string> {
  protected controlTemplate(): TemplateResult {
    return html`
      <style>
        @media (max-width: 380px) {
          .no-padding-left {
            padding-left: 0;
          }
        }
      </style>
      <paper-textarea
        id="textarea"
        class="without-border no-padding-left"
        no-label-float
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        placeholder="&#8212;"
        ?disabled="${this.isReadonly}"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
      >
      </paper-textarea>
    `;
  }

  protected customValidation(): string | null {
    return null;
  }
}
