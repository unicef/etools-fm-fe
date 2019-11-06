import {MonitoringTabComponent} from './monitoring-tab';
import {html, TemplateResult} from 'lit-element';
import '../../../common/progressbar/proportional-progress-bar';
import './geographic-coverage/geographic-coverage';

export function template(this: MonitoringTabComponent): TemplateResult {
  return html`
    <div class="monitoring-activity-container">
      <!--  Overall activity progressbar  -->
      <section class="elevation page-content card-container monitoring-activity__overall-statistics" elevation="1">
        <div class="visits-card">
          <div class="visits-card__item">
            <proportional-progress-bar
              .completed="${this.completed}"
              .planned="${this.planned}"
              .completedLabelValue="Completed Visits"
              .plannedLabelValue="Planned Visits (Up to December)"
              .completedDivBackgroundColor="#3F9BBC"
            >
            </proportional-progress-bar>
          </div>
          <div class="visits-card__item completed-percentage-container">
            ${this.getCompletedPercentage(this.completed, this.planned)} % of visits are completed
          </div>
        </div>
      </section>
      <!--  Coverage tabs  -->
      <section
        class="elevation page-content card-container monitoring-activity__item monitoring-activity__partnership-coverage"
        elevation="1"
      >
        <div class="card-title-box with-bottom-line">
          <div class="card-title">Coverage of Active Partnerships</div>
        </div>
        <etools-tabs
          class="tabs-container"
          id="tabs"
          slot="tabs"
          .tabs="${this.pageTabs}"
          @iron-select="${({detail}: any) => this.onSelect(detail.item)}"
          .activeTab="${this.activeTab}"
        ></etools-tabs>
        <div class="layout vertical card-content">
          ${this.getTabElement()}
        </div>
      </section>

      <div class="monitoring-activity__item">
        <!--  Geographic coverage (map)  -->
        <geographic-coverage></geographic-coverage>
        <!--  Visits table  -->
        <section class="elevation page-content card-container monitoring-activity__hact-visits" elevation="1">
          <div class="card-title-box with-bottom-line">
            <div class="card-title">Visits Eligible for HACT Programmatic Visit</div>
          </div>
          <div class="layout vertical card-content">
            some sort of testing
          </div>
        </section>
      </div>
    </div>
  `;
}
