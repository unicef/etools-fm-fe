import {MonitoringTabComponent} from './monitoring-tab';
import {html, TemplateResult} from 'lit-element';
import '../../../common/progressbar/proportional-progress-bar';
import './geographic-coverage/geographic-coverage';
import './open-issues-action-points/open-issues-action-points';
import './shared-section-with-tabs-template/shared-section-with-tabs-template';

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
      <shared-section-with-tabs-template
        class="monitoring-activity__item"
        .title="${'Coverage of Active Partnerships'}"
        .pageTabs="${this.coveragePageTabs}"
        .activeTab="${this.coverageActiveTab}"
        .tabContentMap="${this.coverageOfActivePartnershipsContentMap}"
      ></shared-section-with-tabs-template>

      <div class="monitoring-activity__item">
        <!--  Geographic coverage (map)  -->
        <geographic-coverage></geographic-coverage>
        <!--  Open issues and Action points  -->
        <shared-section-with-tabs-template
          .title="${'Open Issues and Action Points'}"
          .pageTabs="${this.openIssuesPageTabs}"
          .activeTab="${this.openIssuesActiveTab}"
          .tabContentMap="${this.openIssuesContentMap}"
        ></shared-section-with-tabs-template>
      </div>
    </div>
  `;
}
