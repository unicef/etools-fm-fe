import {PdSsfaDetails} from './pd-ssfa-details';
import {html, TemplateResult} from 'lit';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import {translate} from 'lit-translate';

export function template(this: PdSsfaDetails): TemplateResult {
  return html`
    <section class="elevation page-content card-container" elevation="1">
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="card-title-box">
        <div class="card-title counter">${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.TITLE')}</div>
      </div>

      <etools-data-table-header no-title no-collapse>
        <etools-data-table-column class="flex-1 col-data"
          >${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.REFERENCE_NUMBER')}</etools-data-table-column
        >
        <etools-data-table-column class="flex-1 col-data"
          >${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.DOCUMENT_TYTLE')}</etools-data-table-column
        >
        <etools-data-table-column class="flex-1 col-data"
          >${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.TYPE')}</etools-data-table-column
        >
        <etools-data-table-column class="flex-1 col-data"
          >${translate('ACTIVITY_ADDITIONAL_INFO.PD_SPD_DETAILS.PROGRESS_REPORTS')}</etools-data-table-column
        >
      </etools-data-table-header>

      ${!this.interventions || !this.interventions.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal editable-row flex">
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-1">-</div>
              </div>
            </etools-data-table-row>
          `
        : ''}
      ${this.getTargetInterventions().map(
        (intervention: IActivityIntervention) => html`
          <etools-data-table-row no-collapse secondary-bg-on-hover>
            <div slot="row-data" class="layout horizontal editable-row flex">
              <div class="col-data flex-1">
                <a class="link-cell link-content" href="/pmp/interventions/${intervention.id}/metadata" target="_blank">
                  <paper-icon-button icon="icons:launch"></paper-icon-button>
                  <label class="link-text">${intervention.number}</label>
                </a>
              </div>
              <div class="col-data flex-1">${intervention.title}</div>
              <div class="col-data flex-1">${intervention.document_type}</div>
              <div class="col-data flex-1">
                <a
                  class="link-cell link-content"
                  href="/pmp/interventions/${intervention.id}/progress/reports"
                  target="_blank"
                >
                  <paper-icon-button icon="icons:launch"></paper-icon-button>
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
