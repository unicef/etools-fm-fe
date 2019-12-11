import {html, customElement, TemplateResult} from 'lit-element';
import {BaseFinding} from './base-finding';
import '@polymer/paper-input/paper-textarea';

@customElement('text-finding')
export class TextFinding extends BaseFinding<string> {
  protected controlTemplate(): TemplateResult {
    return html`
      <paper-textarea
        id="textarea"
        class="without-border"
        no-label-float
        .value="${this.value}"
        @value-changed="${({detail}: CustomEvent) => this.valueChanged(detail.value)}"
        placeholder="&#8212;"
        ?disabled="${this.isReadonly}"
      >
      </paper-textarea>
    `;
  }
}
