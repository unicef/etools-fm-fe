import { customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { initProgressbarData } from '../../utils/progressbar-utils';

@customElement('progress-bar')
export class ProgressBar extends LitElement {
    @property() public progressbarData: ProgressBarData = initProgressbarData();

    public constructor() {
        super();
    }

    public getCompletedPercentage(): number {
        return this.progressbarData.completed / this.progressbarData.planned * 100;
    }

    public getCompletedDivWidth(): string {
        return `${this.progressbarData.completed / this.progressbarData.planned * 100}%`;
    }

    public getMinRequiredDivWidth(): string {
        return `${ this.progressbarData.minRequired / this.progressbarData.planned * 100}%`;
    }

    public render(): TemplateResult {
        return html`
            <style>
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
                  visibility: ${ this.progressbarData.minRequired ? 'visible' : 'hidden'};
                }

                .progressbar__content {
                  position: relative;
                  height: 30px;
                  display: flex;
                  align-items: center;
                }

                .progressbar-min-required {
                  visibility: ${ this.progressbarData.minRequired ? 'visible' : 'hidden' };
                  position: absolute;
                  left: 0;
                  top: 0;
                  border-bottom: 2px solid;
                  border-right: 2px solid;
                  border-color: lightcoral;
                  width: ${ this.getMinRequiredDivWidth() };
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
                  background-color: ${ this.progressbarData.completedDivBackgroundColor };
                  width: ${ this.getCompletedDivWidth() };
                  color: white;
                }

                .progressbar-planned {
                  background-color: lightgrey;
                  flex-grow: 1;
                  color: black;
                }

                .progressbar-label {
                  color: ${ this.progressbarData.progressBarLabelsColor };
                }
            </style>
          <div class="progressbar-host">
            <div class="progressbar__header">
              <label class="progressbar-label">Completed ${ this.progressbarData.additionalCompletedLabelValue }</label>
              <label class="progressbar-label">Planned ${ this.progressbarData.additionalPlannedLabelValue }</label>
            </div>
            <div class="progressbar__content">
              <div class="progressbar">
                <div class="progressbar-values-container">
                  <label class="progressbar-value">${ this.progressbarData.completed }</label>
                  <label class="progressbar-value">${ this.progressbarData.planned }</label>
                </div>
                <div class="progressbar-completed"></div>
                <div class="progressbar-planned"></div>
              </div>
              <div class="progressbar-min-required" ></div>
            </div>
            <div class="progressbar__footer">
              <label class="progressbar-label">Minimum Required ${ this.progressbarData.minRequired }</label>
              <label class="progressbar-label">Days Since Last Visit ${ this.progressbarData.daysSinceLastVisit }</label>
            </div>
          </div>
        `;
    }
}
