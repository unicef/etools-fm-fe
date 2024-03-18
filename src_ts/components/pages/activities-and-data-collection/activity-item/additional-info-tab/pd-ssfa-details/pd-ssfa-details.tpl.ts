import {PdSsfaDetails} from './pd-ssfa-details';
import {html, TemplateResult} from 'lit';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';
import {translate} from 'lit-translate';

export function template(this: PdSsfaDetails): TemplateResult {
  return html`
    <style>
      ${dataTableStylesLit}
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
      <div class="card-title-box">
        <div class="card-title counter">${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.TITLE')}</div>
      </div>

      <etools-data-table-header no-title no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
        <etools-data-table-column class="table-header-padding col-3 col-data"
          >${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.REFERENCE_NUMBER')}</etools-data-table-column
        >
        <etools-data-table-column class="table-header-padding col-3 col-data"
          >${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.DOCUMENT_TYTLE')}</etools-data-table-column
        >
        <etools-data-table-column class="table-header-padding col-3 col-data"
          >${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.TYPE')}</etools-data-table-column
        >
        <etools-data-table-column class="table-header-padding col-3 col-data"
          >${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.PROGRESS_REPORTS')}</etools-data-table-column
        >
      </etools-data-table-header>

      ${!this.interventions || !this.interventions.length
        ? html`
            <etools-data-table-row no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
              <div slot="row-data" class="editable-row row">
                <div class="col-data col-12 no-data">${translate('NO_RECORDS')}</div>
              </div>
            </etools-data-table-row>
          `
        : ''}
      ${this.getTargetInterventions().map(
        (intervention: IActivityIntervention) => html`
          <etools-data-table-row no-collapse secondary-bg-on-hover .lowResolutionLayout="${this.lowResolutionLayout}">
            <div slot="row-data" class="editable-row row">
              <div
                class="col-data col-3"
                data-col-header-label="${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.REFERENCE_NUMBER')}"
              >
                <a class="link-cell link-content" href="/pmp/interventions/${intervention.id}/metadata" target="_blank">
                  <etools-icon-button name="launch"></etools-icon-button>
                  <label class="link-text">${intervention.number}</label>
                </a>
              </div>
              <div
                class="col-data col-3"
                data-col-header-label="${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.DOCUMENT_TYTLE')}"
              >
                ${intervention.title}
              </div>
              <div
                class="col-data col-3"
                data-col-header-label="${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.TYPE')}"
              >
                ${intervention.document_type}
              </div>
              <div
                class="col-data col-3"
                data-col-header-label="${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.PROGRESS_REPORTS')}"
              >
                <a
                  class="link-cell link-content"
                  href="/pmp/interventions/${intervention.id}/progress/reports"
                  target="_blank"
                >
                  <etools-icon-button name="launch"></etools-icon-button>
                  <label class="link-text" style="text-transform: uppercase">${translate('VIEW')}</label>
                </a>
              </div>
            </div>
          </etools-data-table-row>
        `
      )}

      <etools-data-table-footer
        id="footer"
        .rowsPerPageText="${translate('ROWS_PER_PAGE')}"
        .pageSize="${this.pageSize || undefined}"
        .pageNumber="${this.pageNumber || undefined}"
        .totalResults="${this.interventions ? this.interventions.length : 0}"
        @page-size-changed="${(event: CustomEvent) => this.onPageSizeChange(event.detail.value)}"
        @page-number-changed="${(event: CustomEvent) => this.onPageNumberChange(event.detail.value)}"
      >
      </etools-data-table-footer>
    </section>
  `;
}
