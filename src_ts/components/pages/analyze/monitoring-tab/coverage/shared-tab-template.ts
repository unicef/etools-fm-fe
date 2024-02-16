import {css, LitElement, TemplateResult, html, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import '../../../../common/progressbar/column-item-progress-bar';
import {repeat} from 'lit/directives/repeat.js';
import {translate} from 'lit-translate';
import PaginationMixin from '@unicef-polymer/etools-modules-common/dist/mixins/pagination-mixin';

enum WidthCalculationTargets {
  DAYS = 'days',
  AVG = 'avg'
}

// TODO think about name
@customElement('shared-tab-template')
export class SharedTabTemplate extends PaginationMixin(LitElement) {
  @property() paginatedData!: (InterventionsCoverage | CpOutputCoverage)[];
  @property() loading = false;
  @property() label!: string;
  private _data!: (InterventionsCoverage | CpOutputCoverage)[];

  @property()
  get data(): (InterventionsCoverage | CpOutputCoverage)[] {
    return this._data;
  }

  set data(val: (InterventionsCoverage | CpOutputCoverage)[]) {
    this._data = val;
    this.paginator = {...this.paginator, page: 1, page_size: 10, count: this._data.length};
  }

  render(): TemplateResult {
    return html`
      <div class="coverage-content">
        <etools-loading
          ?active="${this.loading}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>
        <!--   Tab content label   -->
        <label class="coverage-label">${this.label}</label>
        ${repeat<InterventionsCoverage | CpOutputCoverage>(
          this.paginatedData,
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
        <etools-data-table-footer
          .rowsPerPageText="${translate('ROWS_PER_PAGE')}"
          .pageSize="${this.paginator.page_size}"
          .pageNumber="${this.paginator.page}"
          .totalResults="${this.paginator.count}"
          .visibleRange="${this.paginator.visible_range}"
          @visible-range-changed="${this.visibleRangeChanged}"
          @page-size-changed="${this.pageSizeChanged}"
          @page-number-changed="${this.pageNumberChanged}"
        >
        </etools-data-table-footer>
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

  _paginate(pageNumber: number, pageSize: number): void {
    if (!this.data) {
      return;
    }
    this.paginatedData = (this.data || []).slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
  }

  paginatorChanged(): void {
    this._paginate(this.paginator.page, this.paginator.page_size);
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
        font-size: var(--etools-font-size-16, 16px);
      }
      .progressbar-container {
        margin-bottom: 2%;
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
      }
      .progressbar__header {
        color: grey;
        font-size: var(--etools-font-size-16, 16px);
        line-height: 47px;
      }
    `;
  }
}
