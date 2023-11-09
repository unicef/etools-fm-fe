import {html, css, LitElement, TemplateResult, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {StyleInfo, styleMap} from 'lit/directives/style-map';

@customElement('column-item-progress-bar')
export class ColumnItemProgressBar extends LitElement {
  @property() progressValue: number | null = null;
  @property() width = '0';
  @property() labelValue: string | null = null;
  @property() completedDivBackgroundColor = '#D8D8D8';
  private widthComputedStyle!: StyleInfo;

  render(): TemplateResult {
    return html`
      <div class="progressbar-host">
        <!--  Top labels  -->
        <div class="progressbar__header">
          <label class="progressbar-label">${this.labelValue}</label>
        </div>
        <!--  Progress bar  -->
        <div class="progressbar__content">
          <div class="progressbar">
            <div class="progressbar-completed" style="${styleMap(this.widthComputedStyle)}"></div>
          </div>
          <div class="progressbar-value">${this.progressValue || 0}</div>
        </div>
      </div>
    `;
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.widthComputedStyle = {
      width: `${this.width}%`,
      'background-color': this.completedDivBackgroundColor
    };
  }

  static get styles(): CSSResult {
    return css`
      .progressbar-host {
        display: flex;
        flex-direction: column;
      }

      .progressbar__header {
        display: flex;
        justify-content: space-between;
      }

      .progressbar__content {
        height: 30px;
        display: flex;
        align-items: center;
      }

      .progressbar {
        flex-basis: 95%;
        height: 65%;
        display: flex;
      }

      .progressbar-value {
        flex-basis: 5%;
        justify-content: center;
        display: flex;
      }

      .progressbar-completed {
        background-color: grey;
        width: 0;
      }

      .progressbar-label {
        color: grey;
      }
    `;
  }
}
