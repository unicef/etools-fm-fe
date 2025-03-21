import {html, TemplateResult} from 'lit';
import {PartnershipTab} from './partnership-tab';
import '../../../../../common/progressbar/proportional-progress-bar';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import {repeat} from 'lit/directives/repeat.js';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table-footer';

export function template(this: PartnershipTab): TemplateResult {
  return html`
    <etools-media-query
      query="(max-width: 767px)"
      @query-matches-changed="${(e: CustomEvent) => {
        this.lowResolutionLayout = e.detail.value;
      }}"
    ></etools-media-query>
    <div class="partner-coverage">
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="partner-coverage__header row">
        <!--  Progress bar legend  -->
        <div class="partner-coverage__header-item col-md-8 col-12">
          <div class="coverage-legend">
            <div class="coverage-legend__mark coverage-legend__mark-completed"></div>
            <label class="coverage-legend__label"
              >${translate('ANALYZE.MONITORING_TAB.COVERAGE.PARTNERSHIP.COMPLETED_TASKS')}</label
            >
          </div>
          <div class="coverage-legend">
            <div class="coverage-legend__mark"><div class="coverage-legend__mark-required"></div></div>
            <label class="coverage-legend__label"
              >${translate('ANALYZE.MONITORING_TAB.COVERAGE.PARTNERSHIP.MINIMUM_REQUIRED')}</label
            >
          </div>
        </div>

        <!--  Sorting  -->
        <div class="partner-coverage__header-item sorting-dropdown col-md-4 col-12">
          <etools-dropdown
            .selected="${this.selectedSortingOption}"
            label="${translate('ANALYZE.MONITORING_TAB.COVERAGE.PARTNERSHIP.SORT_BY')}"
            .options="${this.sortingOptions}"
            option-label="display_name"
            option-value="value"
            trigger-value-change-event
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.onSelectionChange(detail.selectedItem.value)}"
            hide-search
            allow-outside-scroll
          >
          </etools-dropdown>
        </div>
      </div>

      <!--  Progress bars list  -->
      ${repeat(
        this.paginatedPartnersCoverage.sort((a: PartnersCoverage, b: PartnersCoverage) => this.sortProgressBars(a, b)),
        (item: PartnersCoverage) => item.id,
        (item: PartnersCoverage) => html`
          <div class="progressbar-container">
            <div class="progressbar-container__header ">${item.name}</div>
            <proportional-progress-bar
              .completed="${item.completed_visits}"
              .planned="${item.planned_visits}"
              .minRequired="${item.minimum_required_visits}"
              .daysSinceLastVisit="${item.days_since_visit}"
              .minRequiredLabelValue="${translate(
                'ANALYZE.MONITORING_TAB.COVERAGE.PARTNERSHIP.MINIMUM_REQUIRED_VISITS'
              )} ${item.minimum_required_visits || ''}"
              .daysSinceLastVisitLabelValue="${translate(
                'ANALYZE.MONITORING_TAB.COVERAGE.PARTNERSHIP.DAYS_SINCE_LAST_VISIT'
              )} ${item.days_since_visit || ''}"
            >
            </proportional-progress-bar>
          </div>
        `
      )}
      <etools-data-table-footer
        .lowResolutionLayout="${this.lowResolutionLayout}"
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
