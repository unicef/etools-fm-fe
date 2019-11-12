import {html, customElement, TemplateResult} from 'lit-element';
import {BaseFinding} from './base-finding';
import '@polymer/paper-input/paper-input';

@customElement('text-finding')
export class TextFinding extends BaseFinding<string> {
  protected controlTemplate(): TemplateResult {
    return html`
      <paper-input
        class="without-border"
        no-label-float
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        placeholder="-"
        ?disabled="${this.isReadonly}"
      >
      </paper-input>
    `;
  }
}
