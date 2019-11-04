import { MonitoringTabComponent } from './monitoring-tab';
import { html, TemplateResult } from 'lit-element';
import '../../../common/progressbar/progress-bar';

export function template(this: MonitoringTabComponent): TemplateResult {
    return html`
        <style>
            .monitoring-activity-container {
              display: flex;
              flex-wrap: wrap;
            }

            .monitoring-activity__item {
              flex-grow: 1;
            }

            .monitoring-activity__overall-statistics {
              flex-basis: 100%;
            }

            .monitoring-activity__partnership-coverage {
            }

            .monitoring-activity__geographic-coverage {
            }

            .monitoring-activity__hact-visits {
            }
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

            .tabs-container {
              border-bottom: 1px solid lightgrey;
            }
        </style>
        <div class="monitoring-activity-container">
            <section class="elevation page-content card-container monitoring-activity__overall-statistics" elevation="1">
                <div class="visits-card">
                  <div class="visits-card__item"><progress-bar .progressbarData="${ this.progressbarData }"></progress-bar></div>
                  <div class="visits-card__item completed-percentage-container">${ this.getCompletedPercentage(this.completed, this.planned) } % of visits are completed</div>
                </div>
            </section>
            <section class="elevation page-content card-container monitoring-activity__item monitoring-activity__partnership-coverage" elevation="1">
                <div class="card-title-box with-bottom-line">
                    <div class="card-title">Coverage of Active Partnerships</div>
                </div>
                <etools-tabs class="tabs-container" id="tabs" slot="tabs" .tabs="${this.pageTabs}"
                             @iron-select="${({ detail }: any) => this.onSelect(detail.item)}"
                            .activeTab="${this.activeTab}"></etools-tabs>
                <div class="layout vertical card-content">
                    ${ this.getTabElement() }
                </div>
            </section>
            <div class="monitoring-activity__item">
                <section class="elevation page-content card-container monitoring-activity__geographic-coverage" elevation="1">
                    <div class="card-title-box with-bottom-line">
                        <div class="card-title">Geographic coverage</div>
                    </div>
                    <div class="layout vertical card-content">
                        some sort of testing
                    </div>
                </section>
                <section class="elevation page-content card-container monitoring-activity__hact-visits" elevation="1">
                    <div class="card-title-box with-bottom-line">
                        <div class="card-title">Visits Eligible for HACT Programmatic Visit </div>
                    </div>
                    <div class="layout vertical card-content">
                        some sort of testing
                    </div>
                </section>
            </div>
        </div>
    `;
}
