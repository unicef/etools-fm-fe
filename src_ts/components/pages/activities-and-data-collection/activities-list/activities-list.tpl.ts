import {ActivitiesListComponent} from './activities-list';
import {html, TemplateResult} from 'lit-element';
import '@unicef-polymer/etools-data-table/etools-data-table.js';
import '@unicef-polymer/etools-filters/src/etools-filters';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {translate} from 'lit-translate';
import {formatDate} from '@unicef-polymer/etools-utils/dist/date.util';

export function template(this: ActivitiesListComponent): TemplateResult {
  return html`
    <style>
      etools-filters {
        --paper-input-prefix: {
          color: var(--secondary-text-color, rgba(0, 0, 0, 0.54));
        }
        --paper-input-container-label-floating: {
          font-size: 14px;
          top: 0px;
        }
      }
    </style>
    <page-content-header with-tabs-visible>
      <h1 slot="page-title">${translate('ACTIVITIES_LIST.TITLE')}</h1>
      <div
        slot="title-row-actions"
        class="content-header-actions"
        ?hidden="${!hasPermission(Permissions.CREATE_VISIT)}"
      >
        <paper-button class="create-new" @tap="${this.goNew}" tracker="Create New Visit">
          ${translate('ACTIVITIES_LIST.CREATE_NEW_BUTTON')}</paper-button
        >
      </div>
    </page-content-header>

    <section class="elevation page-content card-container filters-section search-container" elevation="1">
      <div class="search-input">
        <paper-input
          type="search"
          .value="${this.queryParams && this.queryParams.search}"
          placeholder="${translate('ACTIVITIES_LIST.REFERENCE_NO')}"
          @value-changed="${(event: CustomEvent) => this.searchKeyDown(event)}"
          inline
        >
          <iron-icon icon="search" slot="prefix"></iron-icon>
        </paper-input>
      </div>

      <etools-filters
        class="search-filters"
        .filters="${this.filters}"
        .textFilters="${translate('FILTERS_ELEMENT.TITLE')}"
        .textClearAll="${translate('FILTERS_ELEMENT.CLEAR_ALL')}"
        @filter-change="${this.filtersChange}"
      ></etools-filters>
    </section>

    <!-- Table -->
    <section class="elevation page-content card-container activities-table-section" elevation="1">
      <!-- Spinner -->
      <etools-loading
        ?active="${this.loadingInProcess}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <!-- Table Header -->
      <etools-data-table-header no-title ?no-collapse="${!this.items.length}">
        <etools-data-table-column class="col-data flex-none w130px">
          ${translate('ACTIVITIES_LIST.COLUMNS.REFERENCE_NUMBER')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-none w110px">
          ${translate('ACTIVITIES_LIST.COLUMNS.START_DATE')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-2">
          ${translate('ACTIVITIES_LIST.COLUMNS.LOCATION_AND_SITE')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-1">
          ${translate('ACTIVITIES_LIST.COLUMNS.SECTIONS')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-none w90px">
          ${translate('ACTIVITIES_LIST.COLUMNS.MONITOR_TYPE')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-2">
          ${translate('ACTIVITIES_LIST.COLUMNS.TEAM_MEMBERS')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-none w80px">
          ${translate('ACTIVITIES_LIST.COLUMNS.CHECKLISTS_COUNT')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data flex-none w100px">
          ${translate('ACTIVITIES_LIST.COLUMNS.STATUS')}
        </etools-data-table-column>
      </etools-data-table-header>

      <!-- Table Empty Row -->
      ${!this.items.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal editable-row flex">
                <div class="col-data flex-none w130px">-</div>
                <div class="col-data flex-none w110px">-</div>
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-1">-</div>
                <div class="col-data flex-none w90px">-</div>
                <div class="col-data flex-2">-</div>
                <div class="col-data flex-none w80px">-</div>
                <div class="col-data flex-none w100px">-</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <!-- Table Row items -->
      ${this.items.map(
        (activity: IListActivity) => html`
          <etools-data-table-row secondary-bg-on-hover>
            <div slot="row-data" class="layout horizontal editable-row flex">
              <div class="col-data flex-none w130px">
                <a class="link-cell" href="${this.getActivityDetailsLink(activity)}"
                  >${activity.reference_number}</a
                >
              </div>
              <div class="col-data flex-none w110px">${formatDate(activity.start_date!) || '-'}</div>
              <div class="col-data flex-2">
                ${activity.location && activity.location.name}
                ${activity.location_site ? `[${activity.location_site.name}]` : ''}
              </div>
              <div class="col-data flex-1">${activity.sections?.map((s: any) => s.name).join(' | ')}</div>
              <div class="col-data flex-none w90px">
                ${this.serializeName(activity.monitor_type, this.activityTypes, 'display_name', 'value') || '-'}
              </div>
              <div class="col-data flex-2">
                <span style="font-weight: 500">${activity.visit_lead?.name}</span>&nbsp;
                ${(activity.team_members &&
                  activity.team_members.map((member: ActivityTeamMember) => ' | ' + member.name)) ||
                '-'}
              </div>
              <div class="col-data flex-none w80px">${activity.checklists_count}</div>
              <div class="col-data flex-none w100px">
                ${this.serializeName(activity.status, this.activityStatuses, 'display_name', 'value')}
              </div>
            </div>

            <div slot="row-data-details" class="layout horizontal">
              ${activity.tpm_partner
                ? html`
                    <div class="row-details-content">
                      <div class="rdc-title">${translate('ACTIVITIES_LIST.FILTERS.TPM_PARTNERS')}</div>
                      <div class="truncate">${activity.tpm_partner.name}</div>
                    </div>
                  `
                : ''}

              <div class="row-details-content">
                <div class="rdc-title">${translate('ACTIVITIES_LIST.FILTERS.PARTNERS')}</div>
                <div class="truncate">
                  ${activity.partners.map((partner: IActivityPartner) => partner.name).join(' | ') || '-'}
                </div>
              </div>
              <div class="row-details-content">
                <div class="rdc-title">${translate('ACTIVITIES_LIST.FILTERS.INTERVENTIONS')}</div>
                <div class="truncate">
                  ${activity.interventions.map((pdspd: IActivityIntervention) => pdspd.title).join(' | ') || '-'}
                </div>
              </div>
              <div class="row-details-content">
                <div class="rdc-title">${translate('ACTIVITIES_LIST.FILTERS.CP_OUTPUTS')}</div>
                <div class="truncate">
                  ${activity.cp_outputs.map((output: IActivityCPOutput) => output.name).join(' | ') || '-'}
                </div>
              </div>
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
