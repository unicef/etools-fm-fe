import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-unicef/src/etools-icons/etools-icon';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {html, TemplateResult} from 'lit';
import {SitesTabComponent} from './sites-tab';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {translate} from 'lit-translate';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';

export function template(this: SitesTabComponent): TemplateResult {
  return html`
    <style>
      ${dataTableStylesLit} *[slot='row-data'] {
        margin: 0;
      }
      .col-data.col-md-11 {
        padding-left: 65px;
      }
    </style>
    <etools-media-query
      query="(max-width: 767px)"
      @query-matches-changed="${(e: CustomEvent) => {
        this.lowResolutionLayout = e.detail.value;
      }}"
    ></etools-media-query>
    <section class="elevation page-content filters" elevation="1">
      <div class="row">
        <etools-input
          class="search-input col-lg-4 col-md-5 col-12"
          type="search"
          clearable
          always-float-label
          .value="${this.queryParams && this.queryParams.search}"
          placeholder="${translate('SITES.PLACEHOLDERS.SEARCH')}"
          @value-changed="${(event: CustomEvent) => this.searchKeyDown(event)}"
          inline
        >
          <etools-icon name="search" slot="prefix"></etools-icon>
        </etools-input>

        <div class="toggle-button-control col-lg-4 col-md-5 col-12">
          <sl-switch
            .checked="${this.queryParams && this.queryParams.show_inactive}"
            @sl-change="${(event: CustomEvent) => this.changeShowInactive(event)}"
          ></sl-switch>
          <span>${translate('SITES.SHOW_INACTIVE')}</span>
        </div>
      </div>
    </section>

    <section class="elevation page-content sites-table-section" elevation="1">
      <!-- Spinner -->
      <etools-loading
        ?active="${this.listLoadingInProcess}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <div class="card-title-box with-bottom-line">
        <div class="card-title">${translate('SITES.TABLE_CAPTION')}</div>
        <div class="buttons-container">
          <etools-icon-button
            @click="${() => this.openDialog()}"
            class="panel-button"
            ?hidden="${!hasPermission(Permissions.EDIT_SITES)}"
            name="add-box"
          ></etools-icon-button>
        </div>
      </div>

      <etools-data-table-header id="listHeader" no-collapse no-title .lowResolutionLayout="${this.lowResolutionLayout}">
          <etools-data-table-column class="col-4 col-data">
            ${translate('SITES.COLUMNS.ADMIN_LEVEL')}
          </etools-data-table-column>
          <etools-data-table-column class="col-2 col-data">
            ${translate('SITES.COLUMNS.STATUS')}
          </etools-data-table-column>
          <etools-data-table-column class="col-6 col-data">
            ${translate('SITES.COLUMNS.NAME')}
          </etools-data-table-column>
      </etools-data-table-header>

      ${this.items.map(
        (parentLocation: IGroupedSites) => html`
          <etools-data-table-row no-collapse secondary-bg-on-hover .lowResolutionLayout="${this.lowResolutionLayout}">
            <div slot="row-data" class="editable-row">
              <div
                class="col-data col-md-4 col-12 layout-vertical location"
                data-col-header-label="${translate('SITES.COLUMNS.ADMIN_LEVEL')}"
              >
                <span class="admin-level-text">${this.getAdminLevel(parentLocation.admin_level)}</span>
                <span>${parentLocation.name}</span>
              </div>

              <div class="${this.lowResolutionLayout ? '' : 'sites-list'} col-md-8 col-12">
                <div class="row">
                  ${parentLocation.sites.map(
                    (site: Site) => html`
                      <div class=" col-12 site-row align-items-center">
                        <div class="row editable-row">
                          <div
                            class="col-data col-md-3 col-12 ${this.lowResolutionLayout ? '' : 'center-align'}"
                            data-col-header-label="${translate('SITES.COLUMNS.STATUS')}"
                          >
                            <div class="active-marker ${this.getActiveClass(site.is_active)}"></div>
                          </div>
                          <div
                            class="col-data col-md-9 col-12"
                            data-col-header-label="${translate('SITES.COLUMNS.NAME')}"
                          >
                            ${site.name}
                          </div>

                          <div class="hover-block" ?hidden="${!hasPermission(Permissions.EDIT_SITES)}">
                            <etools-icon
                              name="create"
                              @click="${() => this.openDialog(site)}"
                              data-type="edit"
                            ></etools-icon>
                          </div>
                        </div>
                      </div>
                    `
                  )}
                </div>
              </div>
            </div>
          </etools-data-table-row>
        `
      )}
      ${!this.items.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="row">
                <div class="col-data col-12 no-data">${translate('NO_RECORDS')}</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <etools-data-table-footer
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
