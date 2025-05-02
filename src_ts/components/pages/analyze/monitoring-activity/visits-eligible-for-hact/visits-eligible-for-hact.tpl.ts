import {html, TemplateResult} from 'lit';
import {repeat} from 'lit/directives/repeat.js';
import {VisitsEligibleForHact} from './visits-eligible-for-hact';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table-footer';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';

export function template(this: VisitsEligibleForHact): TemplateResult {
  return html`
    <style>
      ${dataTableStylesLit} etools-data-table-row::part(edt-list-row-collapse-wrapper) {
        padding-inline: 40px 12px;
      }
    </style>
    <etools-media-query
      query="(max-width: 767px)"
      @query-matches-changed="${(e: CustomEvent) => {
        this.lowResolutionLayout = e.detail.value;
      }}"
    ></etools-media-query>
    <section class="elevation page-content card-container" elevation="1">
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="card-title-box with-bottom-line">
        <div class="card-title">${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.TITLE')}</div>
      </div>
      <div class="hact-visits">
        <etools-data-table-header
          no-title
          ?no-collapse="${!this.items.length}"
          .lowResolutionLayout="${this.lowResolutionLayout}"
        >
          <etools-data-table-column class="col-data col-9" field="name" sortable>
            ${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.PARTNER')}
          </etools-data-table-column>
          <etools-data-table-column class="col-data col-3 hact-visits-label" field="visits_count" sortable>
            ${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.HACT_ELIGIBLE_VISITS')}
          </etools-data-table-column>
        </etools-data-table-header>
        ${!this.items.length
          ? html`
              <etools-data-table-row no-collapse>
                <div slot="row-data" class="editable-row">
                  <div class="col-data col-12 no-data">No records found.</div>
                </div>
              </etools-data-table-row>
            `
          : ''}
        ${repeat(
          this.items,
          (hactVisit: HactVisits) => hactVisit.id,
          (hactVisit: HactVisits) => html`
            <etools-data-table-row
              id="hactVisits"
              secondary-bg-on-hover
              @click="${() => this._resizeMap()}"
              .lowResolutionLayout="${this.lowResolutionLayout}"
            >
              <div slot="row-data" class="editable-row">
                <div
                  class="col-data col-md-9 col-12"
                  data-col-header-label="${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.PARTNER')}"
                >
                  <span class="truncate">${hactVisit.name}</span>
                </div>
                <div
                  class="col-data col-md-3 col-12 hact-visits-label"
                  data-col-header-label="${translate(
                    'ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.HACT_ELIGIBLE_VISITS'
                  )}"
                >
                  <span class="flexible-text">${hactVisit.visits_count}</span>
                </div>
              </div>

              <div slot="row-data-details" class="row">
                <div class="custom-row-details-content col-md-2 col-12">
                  <div class="rdc-title">${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.VISIT')}</div>
                  ${this.getDetailsRefNumber(hactVisit.visits)}
                </div>
                <div class="custom-row-details-content col-md-4 col-12">
                  <div class="rdc-title">${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.CP_OUTPUT')}</div>
                  ${this.getDetailsCpOutput(hactVisit.visits)}
                </div>
                <div class="custom-row-details-content col-md-4 col-12">
                  <div class="rdc-title">${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.PD_SPD')}</div>
                  ${this.getDetailsInterventionTitle(hactVisit.visits)}
                </div>
                <div class="custom-row-details-content col-md-2 col-12">
                  <div class="rdc-title">
                    ${translate('ANALYZE.MONITORING_TAB.VISITS_ELIGIBLE_FOR_HACT.VISIT_END_DATE')}
                    ${this.getDetailsEndDate(hactVisit.visits)}
                  </div>
                </div>
              </div>
              ${hactVisit.visits.length
                ? ``
                : html`
                    <div slot="row-data-details" class="row">
                      <div class="col-data col-12 no-data">${translate('NO_RECORDS')}</div>
                    </div>
                  `}
            </etools-data-table-row>
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
    </section>
  `;
}
