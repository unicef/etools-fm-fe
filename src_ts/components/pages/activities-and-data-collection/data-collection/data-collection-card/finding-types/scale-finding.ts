import {html, customElement, TemplateResult, property} from 'lit-element';
import {BaseFinding} from './base-finding';
import {repeat} from 'lit-html/directives/repeat';
import '@polymer/paper-radio-group/paper-radio-group';
import '@polymer/paper-radio-button/paper-radio-button';
import {PaperRadioButtonElement} from '@polymer/paper-radio-button/paper-radio-button';

@customElement('scale-finding')
export class ScaleFinding extends BaseFinding<string | null> {
  @property({type: Array}) options: QuestionOption[] = [];
  protected controlTemplate(): TemplateResult {
    return html`
      <style>
        .container {
          position: relative;
          min-height: 48px;
        }
        .readonly-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 999;
        }
      </style>

      <div class="container layout horizontal start-justified center">
        <!--   paper-radio-button has bad [disabled] styles customization   -->
        <div class="readonly-overlay" ?hidden="${!this.isReadonly}"></div>

        <paper-radio-group
          selected="${this.value}"
          @iron-select="${({detail}: CustomEvent) => this.onSelect(detail.item)}"
        >
          ${repeat(
            this.options,
            (option: QuestionOption) => html`
              <paper-radio-button name="${option.value}">
                ${option.label}
              </paper-radio-button>
            `
          )}
        </paper-radio-group>

        <paper-button ?hidden="${this.isReadonly}" @click="${() => this.valueChanged(null)}">
          <iron-icon icon="clear"></iron-icon>Clear
        </paper-button>
      </div>
    `;
  }

  protected onSelect(item: PaperRadioButtonElement): void {
    const newValue: string = item.get('name');
    this.valueChanged(newValue);
  }
}
