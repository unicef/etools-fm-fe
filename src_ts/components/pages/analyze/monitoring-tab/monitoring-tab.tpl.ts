import { MonitoringTabComponent } from './monitoring-tab';
import { html, TemplateResult } from 'lit-element';
// import { ProgressbarStyles } from '../../../styles/progressbar-styles';

export function template(this: MonitoringTabComponent): TemplateResult {
    return html`
        <style>
            .visits-card {
              display: flex;
              justify-content: space-around;
              min-height: 62px;
            }

            .visits-card__item {
              flex-basis: 50%;
              margin: 1%;
            }

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
              visibility: ${ this.minRequired ? 'visible' : 'hidden'};
            }

            .progressbar__content {
              position: relative;
              height: 30px;
              display: flex;
              align-items: center;
            }

            .progressbar-min-required {
              visibility: ${ this.minRequired ? 'visible' : 'hidden' };
              position: absolute;
              left: 0;
              top: 0;
              border-bottom: 2px solid lightcoral;
              border-right: 2px solid lightcoral;
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
              background-color: cadetblue;
              width: ${ this.getCompletedDivWidth() };
              color: white;
            }

            .progressbar-planned {
              background-color: lightgrey;
              flex-grow: 1;
              color: black;
            }

            .progressbar-label {
              color: ${ this.progressBarLabelsColor };
            }
        </style>
        <section class="elevation page-content card-container" elevation="1">
            <div class="visits-card">
              <div class="visits-card__item progressbar-host">
                <div class="progressbar__header">
                  <label class="progressbar-label">Completed ${ this.additionalCompletedLabelValue }</label>
                  <label class="progressbar-label">Planned ${ this.additionalPlannedLabelValue }</label>
                </div>
                <div class="progressbar__content">
                  <div class="progressbar">
                    <div class="progressbar-values-container">
                      <label class="progressbar-value">${ this.completed }</label>
                      <label class="progressbar-value">${ this.planned }</label>
                    </div>
                    <div class="progressbar-completed"></div>
                    <div class="progressbar-planned"></div>
                  </div>
                  <div class="progressbar-min-required" ></div>
                </div>
                <div class="progressbar__footer">
                  <label class="progressbar-label">Minimum Required ${ this.minRequired }</label>
                  <label class="progressbar-label">Days Since Last Visit ${ this.daysSinceLastVisit }</label>
                </div>
              </div>
              <div class="visits-card__item">${ this.getCompletedPercentage() } % of visits are completed</div>
            </div>
        </section>`;
}
