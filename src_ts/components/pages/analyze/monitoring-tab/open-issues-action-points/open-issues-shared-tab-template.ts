import {CSSResult, LitElement, TemplateResult, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {StyleInfo, styleMap} from 'lit/directives/style-map';
import {openIssuesSharedTabTemplateStyles} from './open-issues-shared-tab-template.styles';
import {translate} from 'lit-translate';
import PaginationMixin from '@unicef-polymer/etools-modules-common/dist/mixins/pagination-mixin';
import '@unicef-polymer/etools-data-table/etools-data-table-footer';

@customElement('open-issues-shared-tab-template')
export class OpenIssuesSharedTabTemplate extends PaginationMixin(LitElement) {
  @property() paginatedData!: OpenIssuesActionPoints[];
  @property() loading = false;
  private _data!: OpenIssuesActionPoints[];

  @property()
  get data(): OpenIssuesActionPoints[] {
    return this._data;
  }

  set data(val: OpenIssuesActionPoints[]) {
    this._data = val;
    this.paginator = {...this.paginator, page: 1, page_size: 10, count: this._data.length};
  }

  static get styles(): CSSResult {
    return openIssuesSharedTabTemplateStyles;
  }

  render(): TemplateResult {
    return html`
      <div class="open-issues">
        <etools-loading
          ?active="${this.loading}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>
        <!--  Legend  -->
        <div class="open-issues__legend">
          <div class="legend">
            <div class="legend__mark legend__mark-issues"></div>
            <label class="coverage-legend__label"
              >${translate('ANALYZE.MONITORING_TAB.COVERAGE.OPEN_ISSUES.ISSUES')}</label
            >
          </div>
          <div class="legend">
            <div class="legend__mark legend__mark-action-points"></div>
            <label class="coverage-legend__label"
              >${translate('ANALYZE.MONITORING_TAB.COVERAGE.OPEN_ISSUES.ACTION_POINTS')}</label
            >
          </div>
        </div>
        ${this.paginatedData.map(
          (item: OpenIssuesActionPoints) => html`
            <div class="progressbar-host">
              <!--  Top Label  -->
              <div class="progressbar__header">
                <label class="progressbar-label">${item.name}</label>
              </div>
              <!--  Progress bar  -->
              <div class="progressbar__content">
                <!--  Open issues  -->
                <div
                  class="progressbar-issues"
                  style="${styleMap(this.getProgressBarDivWidth(item, 'log_issues_count'))}"
                >
                  <div class="progressbar-value">${item.log_issues_count}</div>
                </div>
                <!--  Action points  -->
                <div
                  class="progressbar-action-points"
                  style="${styleMap(this.getProgressBarDivWidth(item, 'action_points_count'))}"
                >
                  <div class="progressbar-value">${item.action_points_count}</div>
                </div>
              </div>
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

  getProgressBarDivWidth(
    item: OpenIssuesActionPoints,
    property: 'log_issues_count' | 'action_points_count'
  ): StyleInfo {
    const total: number = item.log_issues_count + item.action_points_count;
    if (total === 0) {
      return {width: '50%'};
    } else {
      const width: number = (item[property] / total) * 100;
      return width ? {width: `${width}%`} : {display: 'none', width: '0%'};
    }
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
}
