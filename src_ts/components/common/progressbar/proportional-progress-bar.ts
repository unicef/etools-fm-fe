import {html, css, LitElement, TemplateResult, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {StyleInfo, styleMap} from 'lit/directives/style-map';
import {translate} from 'lit-translate';

@customElement('proportional-progress-bar')
export class ProportionalProgressBar extends LitElement {
  @property() completed = 0;
  @property() planned = 0;
  @property() minRequired: number | null = null;
  @property() daysSinceLastVisit: number | null = null;
  @property() completedLabelValue: string | null = 'PROGRESSBAR.COMPLETED';
  @property() plannedLabelValue: string | null = 'PROGRESSBAR.PLANNED';
  @property() minRequiredLabelValue: string | null = null;
  @property() daysSinceLastVisitLabelValue: string | null = null;
  @property() progressBarLabelsColor = 'grey';
  @property() completedDivBackgroundColor = '#48B6C2';
  private progressbarFooterComputedStyles!: StyleInfo;
  private progressbarMinRequiredComputedStyles!: StyleInfo;
  private progressbarCompletedComputedStyles!: StyleInfo;
  private progressbarLabelComputedStyles!: StyleInfo;

  render(): TemplateResult {
    this.updateProgressbarStyles();
    return html`
      <div class="progressbar-host">
        <!--  Top labels  -->
        <div class="progressbar__header">
          <label class="progressbar-label" style="${styleMap(this.progressbarLabelComputedStyles)}"
            >${this.completedLabelValue ? translate(this.completedLabelValue) : this.completedLabelValue}</label
          >
          <label class="progressbar-label" style="${styleMap(this.progressbarLabelComputedStyles)}"
            >${this.plannedLabelValue ? translate(this.plannedLabelValue) : this.plannedLabelValue}</label
          >
        </div>
        <!--  Progress bar  -->
        <div class="progressbar__content">
          <div class="progressbar">
            <div class="progressbar-values-container">
              <label class="progressbar-value">${this.completed}</label>
              <label class="progressbar-value">${this.planned}</label>
            </div>
            <div class="progressbar-completed" style="${styleMap(this.progressbarCompletedComputedStyles)}"></div>
            <div class="progressbar-planned"></div>
          </div>
          <div class="progressbar-min-required" style="${styleMap(this.progressbarMinRequiredComputedStyles)}"></div>
        </div>
        <!--  Bottom labels  -->
        <div class="progressbar__footer" style="${styleMap(this.progressbarFooterComputedStyles)}">
          <label class="progressbar-label" style="${styleMap(this.progressbarLabelComputedStyles)}"
            >${this.minRequiredLabelValue}</label
          >
          <label class="progressbar-label" style="${styleMap(this.progressbarLabelComputedStyles)}"
            >${this.daysSinceLastVisitLabelValue}</label
          >
        </div>
      </div>
    `;
  }

  updateProgressbarStyles(): void {
    this.progressbarFooterComputedStyles = {
      display: this.minRequired ? 'flex' : 'none'
    };
    this.progressbarMinRequiredComputedStyles = {
      display: this.minRequired ? 'flex' : 'none',
      width: this.getMinRequiredDivWidth()
    };
    this.progressbarCompletedComputedStyles = {
      'background-color': this.completedDivBackgroundColor,
      width: this.getCompletedDivWidth()
    };
    this.progressbarLabelComputedStyles = {
      color: this.progressBarLabelsColor
    };
  }

  getCompletedPercentage(): number {
    return (this.completed / this.planned) * 100;
  }

  getCompletedDivWidth(): string {
    if (this.completed > this.planned) {
      return '100%';
    } else {
      return `${(this.completed / this.planned) * 100}%`;
    }
  }

  getMinRequiredDivWidth(): string {
    if (!this.minRequired || !this.planned) {
      return '0%';
    } else {
      return `${((this.planned < this.minRequired ? this.planned : this.minRequired) / this.planned) * 100}%`;
    }
  }

  static get styles(): CSSResult {
    return css`
      .progressbar-host {
        display: flex;
        flex-direction: column;
      }

      .progressbar__header,
      .progressbar__footer {
        display: flex;
        justify-content: space-between;
      }

      .progressbar__footer {
        display: none;
      }

      .progressbar__content {
        position: relative;
        height: 30px;
        display: flex;
        align-items: center;
      }

      .progressbar-min-required {
        display: none;
        position: absolute;
        left: 0;
        top: 0;
        border-bottom: 2px solid;
        border-right: 2px solid;
        border-color: lightcoral;
        width: 0;
        height: 100%;
      }

      .progressbar {
        flex-basis: 100%;
        position: relative;
        height: 65%;
        display: flex;
      }

      .progressbar-values-container {
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
      }

      .progressbar-value {
        margin-left: 1%;
        margin-right: 1%;
      }

      .progressbar-completed {
        background-color: grey;
        width: 0;
        color: white;
      }

      .progressbar-planned {
        background-color: lightgrey;
        flex-grow: 1;
        color: black;
      }

      .progressbar-label {
        color: grey;
      }
    `;
  }
}
