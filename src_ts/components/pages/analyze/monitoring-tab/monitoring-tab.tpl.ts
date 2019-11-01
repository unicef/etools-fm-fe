import { MonitoringTabComponent } from './monitoring-tab';
import { html, TemplateResult } from 'lit-element';
import '../../../common/progressbar/progress-bar';

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

            .completed-percentage-container {
              display: flex;
              align-items: center;
            }
        </style>
        <section class="elevation page-content card-container" elevation="1">
            <div class="visits-card">
              <div class="visits-card__item"><progress-bar .progressbarData="${ this.progressbarData }"></progress-bar></div>
              <div class="visits-card__item completed-percentage-container">${ this.getCompletedPercentage(this.completed, this.planned) } % of visits are completed</div>
            </div>
        </section>`;
}
