import {customElement, html, TemplateResult} from 'lit-element';
import {BaseField} from './base-field';
import '@polymer/paper-input/paper-input';

@customElement('number-field')
export class NumberField extends BaseField<number> {
  protected controlTemplate(): TemplateResult {
    return html`
      <style>
        @media (max-width: 380px) {
          .no-padding-left {
            padding-left: 0;
          }
        }
      </style>
      <paper-input
        class="without-border no-padding-left"
        no-label-float
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        placeholder="&#8212;"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
        ?disabled="${this.isReadonly}"
      >
      </paper-input>
    `;
  }

  protected customValidation(): string | null {
    return this.value && isNaN(this.value) ? 'Must be a number' : null;
    // return !this.value || isNaN(this.value) ? 'Must be a number' : null;
  }
}
