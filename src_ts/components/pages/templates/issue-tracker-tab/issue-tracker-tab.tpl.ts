import {html, TemplateResult} from 'lit';
import {IssueTrackerTabComponent} from './issue-tracker-tab';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {repeat} from 'lit/directives/repeat.js';
import '@shoelace-style/shoelace/dist/components/switch/switch.js';
import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch.js';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';
import {prettyDate} from '@unicef-polymer/etools-utils/dist/date.util';
import {simplifyValue} from '../../../utils/objects-diff';
import {translate} from 'lit-translate';

export function template(this: IssueTrackerTabComponent): TemplateResult {
  // language=HTML
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
    <section class="elevation page-content filters" elevation="1">
      <div class="row">
          <div class="filter col-md-3 col-12">
            <etools-dropdown-multi
              label="${translate('ISSUE_TRACKER.CP_OUTPUT')}"
              placeholder="${translate('ISSUE_TRACKER.CP_OUTPUT')}"
              .options="${this.outputs}"
              option-label="name"
              option-value="id"
              .selectedValues="${(this.queryParams && simplifyValue(this.queryParams.cp_output__in)) || []}"
              trigger-value-change-event
              @etools-selected-items-changed="${({detail}: CustomEvent) => this.onOutputsChanged(detail.selectedItems)}"
              .minWidth="160px"
              .autoWidth="${true}"
              horizontal-align="left"
              no-dynamic-align
            ></etools-dropdown-multi>
          </div>
          <div class="filter col-md-3 col-12">
            <etools-dropdown-multi
              label="${translate('ISSUE_TRACKER.PARTNER')}"
              placeholder="${translate('ISSUE_TRACKER.PARTNER')}"
              .options="${this.partners}"
              option-label="name"
              option-value="id"
              .selectedValues="${(this.queryParams && simplifyValue(this.queryParams.partner__in)) || []}"
              trigger-value-change-event
              @etools-selected-items-changed="${({detail}: CustomEvent) => this.onPartnersChanged(detail.selectedItems)}"
              min-width="160px"
              .autoWidth="${true}"
              horizontal-align="left"
              no-dynamic-align
            ></etools-dropdown-multi>
          </div>
          <div class="col-md-3 col-12">
            <etools-dropdown-multi
              label="${translate('ISSUE_TRACKER.LOCATION_SITE')}"
              placeholder="${translate('ISSUE_TRACKER.LOCATION_SITE')}"
              .options="${this.locations}"
              option-label="name"
              option-value="id"
              .selectedValues="${(this.queryParams && simplifyValue(this.queryParams.location__in)) || []}"
              trigger-value-change-event
              @etools-selected-items-changed="${({detail}: CustomEvent) => this.onLocationsChanged(detail.selectedItems)}"
              .minWidth="160px"
              .autoWidth="${true}"
              horizontal-align="left"
              no-dynamic-align
            ></etools-dropdown-multi>
          </div>
          <div class="toggle-button-control filter col-md-3 col-12">
            <sl-switch
              .checked="${this.queryParams && this.queryParams.status}"
              @sl-change="${(event: CustomEvent) => this.changeShowOnlyNew((event.target as SlSwitch).checked)}"
            ></sl-switch>
            <span>${translate('ISSUE_TRACKER.IS_NEW')}</span>
          </div>
        </div>  
    </section>
    <section class="elevation page-content card-container issue-tracker-table-section" elevation="1">
      <etools-loading
        ?active="${this.isLoad}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="card-title-box with-bottom-line">
        <div class="card-title counter">${translate('ISSUE_TRACKER.TABLE_CAPTION', this.tableInformation)}</div>
        <div class="buttons-container">
          <etools-icon-button
            @click="${() => this.openLogIssue()}"
            class="panel-button"
            ?hidden="${!hasPermission(Permissions.EDIT_LOG_ISSUES)}"
            data-type="add"
            name="add-box"
          ></etools-icon-button>
        </div>
      </div>

      <etools-data-table-header
        no-title
        ?no-collapse="${!this.items.length}"
        .lowResolutionLayout="${this.lowResolutionLayout}"
      >
        <etools-data-table-column class="col-data col-md-2" field="related_to_type">
          ${translate('ISSUE_TRACKER.RELATED_TO')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-md-3" field="name" sortable>
          ${translate('ISSUE_TRACKER.NAME')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-md-4" field="issue">
          ${translate('ISSUE_TRACKER.ISSUE')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-md-2" field="attachments">
          ${translate('ISSUE_TRACKER.ATTACHMENTS')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data col-md-1" field="status">
          ${translate('ISSUE_TRACKER.STATUS')}
        </etools-data-table-column>
      </etools-data-table-header>
      ${!this.items.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="editable-row row">
                <div class="col-data col-12 no-data">${translate('NO_RECORDS')}</div>
              </div>
            </etools-data-table-row>
          `
        : ''}
      ${repeat(
        this.items,
        (logIssue: LogIssue) => html`
          <etools-data-table-row secondary-bg-on-hover .lowResolutionLayout="${this.lowResolutionLayout}">
            <div slot="row-data" class="editable-row row">
              <div class="col-data col-md-2" data-col-header-label="${translate('ISSUE_TRACKER.RELATED_TO')}">
                <span class="truncate">
                  ${translate(`ISSUE_TRACKER.RELATED_TYPE.${(logIssue.related_to_type as string).toUpperCase()}`)}
                </span>
              </div>
              <div class="col-data col-md-3" data-col-header-label="${translate('ISSUE_TRACKER.NAME')}">
                <span class="truncate">${this.getName(logIssue)}</span>
              </div>
              <div
                class="col-data align-items-center col-md-4"
                data-col-header-label="${translate('ISSUE_TRACKER.ISSUE')}"
              >
                <span class="flexible-text">${logIssue.issue}</span>
              </div>
              <div class="col-data col-md-2" data-col-header-label="${translate('ISSUE_TRACKER.ATTACHMENTS')}">
                ${logIssue.attachments.length
                  ? html`
                      <div class="files-column" @click="${() => this.viewFiles(logIssue)}">
                        ${logIssue.attachments.length > 1
                          ? translate('ISSUE_TRACKER.ATTACHMENTS_FILES.MULTIPLE')
                          : translate('ISSUE_TRACKER.ATTACHMENTS_FILES.SINGLE')}
                      </div>
                    `
                  : ''}
              </div>

              <div class="col-data col-md-1" data-col-header-label="${translate('ISSUE_TRACKER.STATUS')}">
                ${translate(`ISSUE_TRACKER.STATUSES.${logIssue.status.toUpperCase()}`)}
              </div>

              ${hasPermission(Permissions.EDIT_LOG_ISSUES)
                ? html`
                    <div class="hover-block">
                      <etools-icon name="create" @click="${() => this.openLogIssue(logIssue)}"></etools-icon>
                    </div>
                  `
                : ''}
            </div>

            <div slot="row-data-details" class="row">
              <div class="row-details-content col-md-4 col-12">
                <div class="rdc-title">${translate('ISSUE_TRACKER.AUTHOR')}</div>
                <div class="truncate">${logIssue.author.name}</div>
              </div>
              <div class="row-details-content col-md-4 col-12">
                <div class="rdc-title">${translate('ISSUE_TRACKER.LAST_MODIFIED_BY')}</div>
                <div class="truncate">
                  ${`${logIssue.history[0].by_user_display} - ${prettyDate(
                    logIssue.history[0].created + '',
                    'DD MMM YYYY'
                  )}`}
                </div>
              </div>
              ${logIssue.closed_by
                ? html`
                    <div class="row-details-content col-md-4 col-12">
                      <div class="rdc-title">${translate('ISSUE_TRACKER.CLOSED_BY')}</div>
                      <div class="truncate">${logIssue.closed_by.name}</div>
                    </div>
                  `
                : ''}
            </div>
          </etools-data-table-row>
        `
      )}

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
