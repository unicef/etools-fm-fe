import {MonitoringTabComponent} from './monitoring-tab';
import {html, TemplateResult} from 'lit-element';
import '../../../common/progressbar/proportional-progress-bar';
import './geographic-coverage/geographic-coverage';
import './shared-section-with-tabs-template/shared-section-with-tabs-template';
import './visits-eligible-for-hact/visits-eligible-for-hact';
import {
  COVERAGE_OF_ACTIVE_PARTNERSHIPS_CONTENT_MAP,
  COVERAGE_PAGE_TABS,
  OPEN_ISSUES_CONTENT_MAP,
  OPEN_ISSUES_PAGE_TABS
} from './monitoring-tab.navigation.constants';
import {translate} from 'lit-translate';

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
              completedLabelValue="PROGRESSBAR.COMPLETED_VISITS"
              plannedLabelValue="PROGRESSBAR.PLANNED_VISITS"
              completedDivBackgroundColor="#3F9BBC"
            >
            </proportional-progress-bar>
          </div>
          <div class="visits-card__item completed-percentage-container">
            <label class="overall-completed-label">
              ${this.getCompletedPercentage(this.completed, this.planned)} %
              ${translate('ANALYZE.MONITORING_TAB.COMPLETED_VISITS')}
            </label>
          </div>
        </div>
      </section>

      <!--  Coverage tabs  -->
      <shared-section-with-tabs-template
        class="monitoring-activity__item"
        .sectionTitle="${translate('ANALYZE.MONITORING_TAB.COVERAGE.TITLE')}"
        .pageTabs="${COVERAGE_PAGE_TABS}"
        .activeTab="${this.coverageActiveTab}"
        .tabContentMap="${COVERAGE_OF_ACTIVE_PARTNERSHIPS_CONTENT_MAP}"
      ></shared-section-with-tabs-template>

      <div class="monitoring-activity__item">
        <!--  Geographic coverage (map)  -->
        <geographic-coverage></geographic-coverage>
        ${this.isHactVisitSectionActivated
          ? html`
              <!--  Open issues and Action points  -->
              <shared-section-with-tabs-template
                .sectionTitle="${translate('ANALYZE.MONITORING_TAB.COVERAGE.OPEN_ISSUES.TITLE')}"
                .pageTabs="${OPEN_ISSUES_PAGE_TABS}"
                .activeTab="${this.openIssuesActiveTab}"
                .tabContentMap="${OPEN_ISSUES_CONTENT_MAP}"
              ></shared-section-with-tabs-template>
            `
          : html`
              <!--  Visits section  -->
              <visits-eligible-for-hact></visits-eligible-for-hact>
            `}
      </div>
    </div>
  `;
}
