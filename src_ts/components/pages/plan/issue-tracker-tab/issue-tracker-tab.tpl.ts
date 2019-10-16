import { html, TemplateResult } from 'lit-html';
import { IssueTrackerTabComponent } from './issue-tracker-tab';
import { translate } from '../../../../localization/localisation';
import { hasPermission, Permissions } from '../../../../config/permissions';
import { repeat } from 'lit-html/directives/repeat';
import '@polymer/paper-toggle-button';
import '@unicef-polymer/etools-data-table';
import '@unicef-polymer/etools-dropdown';
import { prettyDate } from '../../../utils/date-utility';
import { simplifyValue } from '../../../utils/objects-diff';

export function template(this: IssueTrackerTabComponent): TemplateResult {
    // language=HTML
    return html`
    <section class="elevation page-content filters layout horizontal" elevation="1">
        <div class="filter">
            <etools-dropdown-multi
                label="${ translate('ISSUE_TRACKER.CP_OUTPUT') }"
                placeholder="${ translate('ISSUE_TRACKER.CP_OUTPUT') }"
                .options="${this.outputs}"
                option-label="name"
                option-value="id"
                .selectedValues="${ this.queryParams && simplifyValue(this.queryParams.cp_output__in) || [] }"
                trigger-value-change-event
                @etools-selected-items-changed="${ ({ detail }: CustomEvent) => this.onOutputsChanged(detail.selectedItems) }"
                .minWidth="160px"
                .autoWidth="${ true }"
                horizontal-align="left"
                no-dynamic-align></div>
        <div class="filter">
            <etools-dropdown-multi
                label="${ translate('ISSUE_TRACKER.PARTNER') }"
                placeholder="${ translate('ISSUE_TRACKER.PARTNER') }"
                .options="${this.partners}"
                option-label="name"
                option-value="id"
                .selectedValues="${ this.queryParams && simplifyValue(this.queryParams.partner__in) || [] }"
                trigger-value-change-event
                @etools-selected-items-changed="${ ({ detail }: CustomEvent) => this.onPartnersChanged(detail.selectedItems) }"
                min-width="160px"
                .autoWidth="${ true }"
                horizontal-align="left"
                no-dynamic-align></etools-dropdown-multi></div>
        <div>
            <etools-dropdown-multi
                label="${ translate('ISSUE_TRACKER.LOCATION_SITE') }"
                placeholder="${ translate('ISSUE_TRACKER.LOCATION_SITE') }"
                .options="${this.locations}"
                option-label="name"
                option-value="id"
                .selectedValues="${ this.queryParams && simplifyValue(this.queryParams.location__in) || [] }"
                trigger-value-change-event
                @etools-selected-items-changed="${ ({ detail }: CustomEvent) => this.onLocationsChanged(detail.selectedItems) }"
                .minWidth="160px"
                .autoWidth="${ true }"
                horizontal-align="left"
                no-dynamic-align></etools-dropdown-multi></div>
        <div class="toggle-button-control filter">
            <paper-toggle-button
                .checked="${this.queryParams && this.queryParams.status}"
                @checked-changed="${({ detail }: CustomEvent) => this.changeShowOnlyNew(detail.value)}"></paper-toggle-button>
            <span>${ translate('ISSUE_TRACKER.IS_NEW') }</span>
        </div>
    </section>
    <section class="elevation page-content card-container issue-tracker-table-section" elevation="1">
        <etools-loading ?active="${ this.isLoad }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>
        <div class="card-title-box with-bottom-line">
            <div class="card-title counter">${ translate('ISSUE_TRACKER.TABLE_CAPTION', this.tableInformation) }</div>
            <div class="buttons-container">
                <paper-icon-button
                    @tap="${() => this.openLogIssue()}"
                    class="panel-button"
                    ?hidden="${ !hasPermission(Permissions.EDIT_LOG_ISSUES) }"
                    data-type="add"
                    icon="add-box"></paper-icon-button>
            </div>
        </div>

        <etools-data-table-header no-title ?no-collapse="${!this.items.length}">
            <etools-data-table-column class="flex-1" field="related_to_type">
                ${translate('ISSUE_TRACKER.RELATED_TO')}
            </etools-data-table-column>
            <etools-data-table-column class="flex-2" field="name" sortable>
                ${translate('ISSUE_TRACKER.NAME')}
            </etools-data-table-column>
            <etools-data-table-column class="flex-3" field="issue">
                ${translate('ISSUE_TRACKER.ISSUE')}
            </etools-data-table-column>
            <etools-data-table-column class="flex-1" field="attachments">
                ${translate('ISSUE_TRACKER.ATTACHMENTS')}
            </etools-data-table-column>
            <etools-data-table-column class="flex-1" field="status">
                ${translate('ISSUE_TRACKER.STATUS')}
            </etools-data-table-column>
        </etools-data-table-header>
        ${!this.items.length ? html`
            <etools-data-table-row no-collapse>
                <div slot="row-data" class="layout horizontal editable-row flex">
                    <div class="col-data flex-1 truncate">-</div>
                    <div class="col-data flex-2 truncate">-</div>
                    <div class="col-data flex-3 truncate">-</div>
                    <div class="col-data flex-1 truncate">-</div>
                    <div class="col-data flex-1 truncate">-</div>
                </div>
            </etools-data-table-row>` : ''}
        ${repeat(this.items, (logIssue: LogIssue) => html`
            <etools-data-table-row secondary-bg-on-hover>
                <div slot="row-data" class="layout horizontal editable-row flex">
                    <div class="col-data flex-1">
                        <span class="truncate">
                            ${translate(`ISSUE_TRACKER.RELATED_TYPE.${
                                (logIssue.related_to_type as string).toUpperCase()
                            }`)}
                        </span>
                    </div>
                    <div class="col-data flex-2">
                        <span class="truncate">${this.getName(logIssue)}</span>
                    </div>
                    <div class="col-data layout center flex-3">
                        <span class="flexible-text">${logIssue.issue}</span>
                    </div>
                    <div class="col-data flex-1">
                        ${logIssue.attachments.length ? html`
                            <div class="files-column" @click="${() => this.openViewDialog(logIssue)}">
                                ${logIssue.attachments.length} FILES
                            </div> ` : ''}
                    </div>

                    <div class="col-data flex-1">
                        ${ translate(`ISSUE_TRACKER.STATUSES.${logIssue.status.toUpperCase()}`)}
                    </div>

                    ${ hasPermission(Permissions.EDIT_LOG_ISSUES) ? html`
                        <div class="hover-block">
                            <iron-icon icon="icons:create" @click="${() => this.openLogIssue(logIssue)}"></iron-icon>
                        </div>` : '' }
                </div>

                <div slot="row-data-details" class="layout horizontal">
                    <div class="row-details-content">
                        <div class="rdc-title">${translate('ISSUE_TRACKER.AUTHOR')}</div>
                        <div class="truncate">${logIssue.author.name}</div>
                    </div>
                    <div class="row-details-content">
                        <div class="rdc-title">${translate('ISSUE_TRACKER.LAST_MODIFIED_BY')}</div>
                        <div class="truncate">${`${logIssue.history[0].by_user_display} - ${prettyDate(logIssue.history[0].created + '', 'DD MMM YYYY')}`}</div>
                    </div>
                    ${logIssue.closed_by ? html`
                        <div class="row-details-content">
                            <div class="rdc-title">${translate('ISSUE_TRACKER.CLOSED_BY')}</div>
                            <div class="truncate">${logIssue.closed_by.name}</div>
                        </div>` : ''}
                </div>
            </etools-data-table-row>
        `)}

        <etools-data-table-footer
                id="footer"
                .pageSize="${ this.queryParams && this.queryParams.page_size || undefined }"
                .pageNumber="${ this.queryParams && this.queryParams.page || undefined }"
                .totalResults="${ this.count }"
                @page-size-changed="${ (event: CustomEvent) => this.changePageParam(event.detail.value, 'page_size') }"
                @page-number-changed="${ (event: CustomEvent) => this.changePageParam(event.detail.value, 'page') }">
        </etools-data-table-footer>
    </section>
`;
}
