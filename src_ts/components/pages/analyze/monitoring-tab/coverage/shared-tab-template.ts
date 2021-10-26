import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '../../../../common/progressbar/column-item-progress-bar';
import {repeat} from 'lit-html/directives/repeat';
import {translate} from 'lit-translate';

enum WidthCalculationTargets {
  DAYS = 'days',
  AVG = 'avg'
}

//TODO think about name
@customElement('shared-tab-template')
export class SharedTabTemplate extends LitElement {
  @property() label!: string;
  @property() data!: InterventionsCoverage[] | CpOutputCoverage[];
  @property() loading = false;

  render(): TemplateResult {
    return html`
      <div class="coverage-content">
        <etools-loading
          ?active="${this.loading}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>
        <!--   Tab content label   -->
        <label class="coverage-label">${this.label}</label>
        ${repeat(
          this.data,
          (item: InterventionsCoverage | CpOutputCoverage) => item.id,
          (item: InterventionsCoverage | CpOutputCoverage) => html`
            <div class="progressbar-container">
              <!--      Progress bar label      -->
              <div class="progressbar__header">
                ${(item as InterventionsCoverage).number || (item as CpOutputCoverage).name}
              </div>
              <!--    Days since last visit indicator      -->
              <column-item-progress-bar
                .progressValue="${item.days_since_visit}"
                .width="${this.calculateProgressBarWidth(item, WidthCalculationTargets.DAYS)}"
                .labelValue="${translate('ANALYZE.MONITORING_TAB.COVERAGE.SHARED_TAB.DAYS_SINCE_LAST_VISIT')}"
                .completedDivBackgroundColor="${item.days_since_visit
                  ? this.computeCompletedDivBackgroundColor(item)
                  : 'green'}"
              >
              </column-item-progress-bar>
              <!--    Average days between visits indicator      -->
              <column-item-progress-bar
                .progressValue="${item.avg_days_between_visits}"
                .width="${this.calculateProgressBarWidth(item, WidthCalculationTargets.AVG)}"
                .labelValue="${translate('ANALYZE.MONITORING_TAB.COVERAGE.SHARED_TAB.AVERAGE_DAYS_SINCE')}"
                .completedDivBackgroundColor="${item.avg_days_between_visits ? '#D8D8D8' : 'green'}"
              >
              </column-item-progress-bar>
            </div>
          `
        )}
      </div>
    `;
  }

  calculateProgressBarWidth(item: InterventionsCoverage | CpOutputCoverage, target: WidthCalculationTargets): number {
    const daysSinceVisit: number | null = item.days_since_visit;
    const avgDaysBetweenVisits: number | null = item.avg_days_between_visits;
    if (daysSinceVisit != null && avgDaysBetweenVisits != null) {
      switch (target) {
        case WidthCalculationTargets.DAYS:
          return (daysSinceVisit / Math.max(daysSinceVisit, avgDaysBetweenVisits)) * 100;
        case WidthCalculationTargets.AVG:
          return (avgDaysBetweenVisits / Math.max(daysSinceVisit, avgDaysBetweenVisits)) * 100;
        default:
          return 0.5;
      }
    } else {
      return 0.5;
    }
  }

  computeCompletedDivBackgroundColor(item: InterventionsCoverage | CpOutputCoverage): string {
    return item.days_since_visit && item.avg_days_between_visits && item.days_since_visit > item.avg_days_between_visits
      ? '#3AB78F'
      : '#FAED77';
  }

  static get styles(): CSSResult {
    return css`
      .coverage-content {
        display: flex;
        flex-direction: column;
        padding: 1%;
      }
      .coverage-label {
        margin-bottom: 2%;
        font-size: 16px;
      }
      .progressbar-container {
        margin-bottom: 2%;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
      }
      .progressbar__header {
        color: grey;
        font-size: 16px;
        line-height: 47px;
      }
    `;
  }
}
