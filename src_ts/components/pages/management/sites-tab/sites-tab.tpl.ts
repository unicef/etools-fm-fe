import '@unicef-polymer/etools-data-table/etools-data-table.js';
import '@polymer/paper-toggle-button';
import '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading';
import '@unicef-polymer/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {html, TemplateResult} from 'lit';
import {SitesTabComponent} from './sites-tab';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {translate} from 'lit-translate';

export function template(this: SitesTabComponent): TemplateResult {
  return html`
    <section class="elevation page-content filters" elevation="1">
      <div class="layout horizontal">
        <etools-input
          class="search-input"
          type="search"
          .value="${this.queryParams && this.queryParams.search}"
          placeholder="${translate('SITES.PLACEHOLDERS.SEARCH')}"
          @value-changed="${(event: CustomEvent) => this.searchKeyDown(event)}"
          inline
        >
          <iron-icon icon="search" slot="prefix"></iron-icon>
        </etools-input>

        <div class="toggle-button-control">
          <paper-toggle-button
            .checked="${this.queryParams && this.queryParams.show_inactive}"
            @checked-changed="${(event: CustomEvent) => this.changeShowInactive(event)}"
          ></paper-toggle-button>
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
          <paper-icon-button
            @tap="${() => this.openDialog()}"
            class="panel-button"
            ?hidden="${!hasPermission(Permissions.EDIT_SITES)}"
            icon="add-box"
          ></paper-icon-button>
        </div>
      </div>

      <etools-data-table-header id="listHeader" no-collapse no-title>
        <etools-data-table-column class="w30 col-data">
          ${translate('SITES.COLUMNS.ADMIN_LEVEL')}
        </etools-data-table-column>
        <etools-data-table-column class="w90px col-data layout center-center">
          ${translate('SITES.COLUMNS.STATUS')}
        </etools-data-table-column>
        <etools-data-table-column class="flex-auto col-data">
          ${translate('SITES.COLUMNS.NAME')}
        </etools-data-table-column>
      </etools-data-table-header>

      ${this.items.map(
        (parentLocation: IGroupedSites) => html`
          <etools-data-table-row no-collapse>
            <div slot="row-data" class="layout horizontal editable-row parent-row">
              <div class="col-data w30 layout vertical start center-justified flex-none">
                <span class="admin-level-text">${this.getAdminLevel(parentLocation.admin_level)}</span>
                <span>${parentLocation.name}</span>
              </div>

              <div class="sites-list">
                ${parentLocation.sites.map(
                  (site: Site) => html`
                    <div class="layout horizontal editable-row site-row center">
                      <div class="col-data w90px layout center-center flex-none">
                        <div class="active-marker ${this.getActiveClass(site.is_active)}"></div>
                      </div>
                      <div class="col-data flex-auto">${site.name}</div>

                      <div class="hover-block" ?hidden="${!hasPermission(Permissions.EDIT_SITES)}">
                        <iron-icon
                          icon="icons:create"
                          @tap="${() => this.openDialog(site)}"
                          data-type="edit"
                        ></iron-icon>
                      </div>
                    </div>
                  `
                )}
              </div>
            </div>
          </etools-data-table-row>
        `
      )}
      ${!this.items.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal">
                <div class="col-data w30">-</div>
                <div class="col-data w90px layout center-center">-</div>
                <div class="col-data w150px">-</div>
                <div class="col-data flex-auto">-</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <etools-data-table-footer
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
