import {html, customElement, TemplateResult, property} from 'lit-element';
import {BaseField} from './base-field';
import '@polymer/paper-input/paper-textarea';
import {InputStyles} from '../../../../../styles/input-styles';

@customElement('wide-field')
export class WideField extends BaseField<string> {
  @property() label: string = '';
  @property() placeholder: string = '';
  protected render(): TemplateResult {
    return html`
      ${InputStyles}
      <style>
        paper-textarea {
          --paper-input-container-input: {
            font-size: 13px;
          }
        }
        paper-input {
          --paper-input-container-shared-input-style: {
            font-size: 13px;
            width: 100%;
          }
        }
      </style>
      <paper-textarea
        class="wide-input disabled-as-readonly"
        always-float-label
        .value="${this.value}"
        label="${this.label}"
        placeholder="${this.isReadonly ? '—' : this.placeholder}"
        ?required="${this.required}"
        ?disabled="${this.isReadonly}"
        ?invalid="${this.errorMessage}"
        error-message="${this.errorMessage}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
      >
      </paper-textarea>
    `;
  }

  protected controlTemplate(): TemplateResult {
    return html``;
  }

  protected customValidation(): string | null {
    return null;
  }
}
