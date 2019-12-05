import {PdSsfaDetails} from './pd-ssfa-details';
import {html, TemplateResult} from 'lit-element';
import '@unicef-polymer/etools-data-table';

export function template(this: PdSsfaDetails): TemplateResult {
  return html`
    <section class="elevation page-content card-container" elevation="1">
      <div class="card-title-box">
        <div class="card-title counter">PD/SSFA Details</div>
      </div>

      <etools-data-table-header no-title no-collapse>
        <etools-data-table-column class="flex-1 col-data">Reference Number</etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data">Document Title</etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data">Type</etools-data-table-column>
        <etools-data-table-column class="flex-1 col-data">Progress Reports</etools-data-table-column>
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
                <a class="link-cell link-content">
                  <paper-icon-button icon="icons:launch"></paper-icon-button>
                  <label class="link-text">${intervention.number}</label>
                </a>
              </div>
              <div class="col-data flex-1">${intervention.title}</div>
              <div class="col-data flex-1">${intervention.document_type}</div>
              <div class="col-data flex-1">
                <a class="link-cell link-content">
                  <paper-icon-button icon="icons:launch"></paper-icon-button>
                  <label class="link-text">VIEW</label>
                </a>
              </div>
            </div>
          </etools-data-table-row>
        `
      )}

      <etools-data-table-footer
        id="footer"
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
