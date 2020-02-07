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
        @keypress="${(event: KeyboardEvent) => this.checkValue(event)}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(Number(detail.value))}"
        placeholder="&#8212;"
        ?disabled="${this.isReadonly}"
      >
      </paper-input>
    `;
  }

  protected checkValue(event: KeyboardEvent): void {
    const currentValue: string = !this.value && this.value !== 0 ? '' : `${this.value}`;
    const newValue: string = `${currentValue}${String.fromCharCode(event.keyCode)}`;
    const newNumberValue: number = Number(newValue);
    if (isNaN(newNumberValue)) {
      event.preventDefault();
    }
  }
}
