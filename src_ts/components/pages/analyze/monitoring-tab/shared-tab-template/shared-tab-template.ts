import {css, CSSResult, customElement, html, LitElement, property, TemplateResult} from 'lit-element';
import '../../../../common/progressbar/column-item-progress-bar';
import {repeat} from 'lit-html/directives/repeat';

enum WidthCalculationTargets {
  DAYS = 'days',
  AVG = 'avg'
}

//TODO think about name
@customElement('shared-tab-template')
export class SharedTabTemplate extends LitElement {
  @property() label!: string;
  @property() data!: InterventionsCoverage[] | CpOutputCoverage[];

  render(): TemplateResult {
    return html`
      <div class="coverage-content">
        <!--   Tab content label   -->
        <label class="coverage-label">${this.label}</label>
        ${repeat(
          this.data,
          (item: InterventionsCoverage) => item.id,
          (item: InterventionsCoverage) => html`
            <div class="progressbar-container">
              <!--      Progress bar label      -->
              <div class="progressbar__header">${item.number}</div>
              <!--    Days since last visit indicator      -->
              <column-item-progress-bar
                .progressValue="${item.days_since_visit}"
                .width="${this.calculateProgressBarWidth(item, WidthCalculationTargets.DAYS)}"
                .labelValue="${'Days Since Last Visit'}"
                .completedDivBackgroundColor="${this.computeCompletedDivBackgroundColor(item)}"
              >
              </column-item-progress-bar>
              <!--    Average days between visits indicator      -->
              <column-item-progress-bar
                .progressValue="${item.avg_days_between_visits}"
                .width="${this.calculateProgressBarWidth(item, WidthCalculationTargets.AVG)}"
                .labelValue="${'Average Days Between Visits'}"
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
          return 0;
      }
    } else {
      return 0;
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
