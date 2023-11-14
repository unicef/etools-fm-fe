import {PartnersListComponent} from './partners-list';
import {html, TemplateResult} from 'lit';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import {translate} from 'lit-translate';

export function template(this: PartnersListComponent): TemplateResult {
  return html`
    <page-content-header with-tabs-visible>
      <h1 slot="page-title">${translate('TPM.TITLE')}</h1>

      <div slot="title-row-actions" class="content-header-actions">
        <paper-button
          id="export"
          @tap="${this.export}"
          ?hidden=${!this.items || !this.items.length}
          tracker="Export TPM Partners"
        >
          <iron-icon icon="file-download" class="export-icon"></iron-icon>
          ${translate('ACTIVITY_DETAILS.EXPORT')}
        </paper-button>

        <paper-button class="primary-btn with-prefix" ?hidden="${!this.showAddButton}" @click="${this.openAddDialog}">
          <iron-icon icon="add"></iron-icon>
          ${translate('TPM.ADD_NEW_VENDOR')}
        </paper-button>
      </div>
    </page-content-header>

    <section class="elevation page-content card-container filters-section search-container" elevation="1">
      <div class="search-input">
        <etools-input
          type="search"
          .value="${this.queryParams && this.queryParams.search}"
          placeholder="${translate('TPM.FILTERS.SEARCH')}"
          @value-changed="${(event: CustomEvent) => this.searchKeyDown(event)}"
          inline
        >
          <iron-icon icon="search" slot="prefix"></iron-icon>
        </etools-input>
      </div>
    </section>

    <!-- Table -->
    <section class="elevation page-content card-container activities-table-section" elevation="1">
      <!-- Spinner -->
      <etools-loading
        ?active="${this.loadingInProcess}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <!-- Table Header -->
      <etools-data-table-header no-title no-collapse>
        <etools-data-table-column class="col-data flex-2" field="vendor_number" sortable>
          ${translate('TPM.COLUMNS.VENDOR_NUMBER')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-3" field="name" sortable>
          ${translate('TPM.COLUMNS.TPM_NAME')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-2" field="phone_number" sortable>
          ${translate('TPM.COLUMNS.PHONE_NUMBER')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-2" field="email" sortable>
          ${translate('TPM.COLUMNS.EMAIL')}
        </etools-data-table-column>
      </etools-data-table-header>

      <!-- Table Empty Row -->
      ${!this.items.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal flex">
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-3">-</div>
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-2">-</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <!-- Table Row items -->
      ${this.items.map(
        (partner: IActivityTpmPartner) => html`
          <etools-data-table-row secondary-bg-on-hover no-collapse>
            <div slot="row-data" class="layout horizontal flex">
              <div class="col-data flex-2">
                <a class="link-cell" href="${`${this.rootPath}partners/${partner.id}/details/`}"
                  >${partner.vendor_number}</a
                >
              </div>
              <div class="col-data flex-3">${partner.name}</div>
              <div class="col-data flex-2">${partner.phone_number}</div>
              <div class="col-data flex-2">${partner.email}</div>
            </div>
          </etools-data-table-row>
        `
      )}

      <!-- Table Paginator -->
      <etools-data-table-footer
        id="footer"
        .rowsPerPageText="${translate('ROWS_PER_PAGE')}"
        .pageSize="${(this.queryParams && this.queryParams.page_size) || undefined}"
        .pageNumber="${(this.queryParams && this.queryParams.page) || undefined}"
        .totalResults="${this.count}"
        @page-size-changed="${(event: CustomEvent) => this.changePageParam(event.detail.value, 'page_size')}"
        @page-number-changed="${(event: CustomEvent) => this.changePageParam(event.detail.value, 'page')}"
      >
      </etools-data-table-footer>
    </section>
  `;
}
