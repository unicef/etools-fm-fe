import {PartnersListComponent} from './partners-list';
import {html, TemplateResult} from 'lit';
import '@unicef-polymer/etools-unicef/src/etools-button/etools-button';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';
import {translate} from 'lit-translate';

export function template(this: PartnersListComponent): TemplateResult {
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
    <page-content-header>
      <h1 slot="page-title">${translate('TPM.TITLE')}</h1>

      <div slot="title-row-actions" class="content-header-actions">
        <etools-button
          id="export"
          class="neutral"
          variant="text"
          @click="${this.export}"
          tracker="Export TPM Partners"
          ?hidden=${!this.items || !this.items.length}
        >
          <etools-icon name="file-download" slot="prefix"></etools-icon>
          ${translate('ACTIVITY_DETAILS.EXPORT')}
        </etools-button>

        <etools-button variant="success" ?hidden="${!this.showAddButton}" @click="${this.openAddDialog}">
          <etools-icon name="add" slot="prefix"></etools-icon>
          ${translate('TPM.ADD_NEW_VENDOR')}
        </etools-button>
      </div>
    </page-content-header>

    <section class="elevation page-content card-container filters-section search-container" elevation="1">
      <div class="search-input row">
        <etools-input
          class="col-md-3 col-12"
          type="search"
          clearable
          always-float-label
          .value="${this.queryParams && this.queryParams.search}"
          placeholder="${translate('TPM.FILTERS.SEARCH')}"
          @value-changed="${(event: CustomEvent) => this.searchKeyDown(event)}"
          inline
        >
          <etools-icon name="search" slot="prefix"></etools-icon>
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
      <etools-data-table-header no-title no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
        <etools-data-table-column class="col-data col-3" field="vendor_number" sortable>
          ${translate('TPM.COLUMNS.VENDOR_NUMBER')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-4" field="name" sortable>
          ${translate('TPM.COLUMNS.TPM_NAME')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-2" field="phone_number" sortable>
          ${translate('TPM.COLUMNS.PHONE_NUMBER')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-3" field="email" sortable>
          ${translate('TPM.COLUMNS.EMAIL')}
        </etools-data-table-column>
      </etools-data-table-header>

      <!-- Table Empty Row -->
      ${!this.items.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="row">
                <div class="col-data col-12 no-data">${translate('NO_RECORDS')}</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <!-- Table Row items -->
      ${this.items.map(
        (partner: IActivityTpmPartner) => html`
          <etools-data-table-row secondary-bg-on-hover no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
            <div slot="row-data" class="row">
              <div class="col-data col-3" data-col-header-label="${translate('TPM.COLUMNS.VENDOR_NUMBER')}">
                <a class="link-cell" href="${`${this.rootPath}partners/${partner.id}/details/`}"
                  >${partner.vendor_number}</a
                >
              </div>
              <div class="col-data col-4" data-col-header-label="${translate('TPM.COLUMNS.TPM_NAME')}">
                ${partner.name}
              </div>
              <div class="col-data col-2" data-col-header-label="${translate('TPM.COLUMNS.PHONE_NUMBER')}">
                ${partner.phone_number}
              </div>
              <div class="col-data col-3" data-col-header-label="${translate('TPM.COLUMNS.EMAIL')}">
                ${partner.email}
              </div>
            </div>
          </etools-data-table-row>
        `
      )}

      <!-- Table Paginator -->
      <etools-data-table-footer
        id="footer"
        .lowResolutionLayout="${this.lowResolutionLayout}"
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
