import '@unicef-polymer/etools-data-table';
import '@polymer/paper-toggle-button';
import '@unicef-polymer/etools-loading';
import '@unicef-polymer/etools-dialog';
import '@unicef-polymer/etools-dropdown';
import '@polymer/paper-input/paper-textarea';
import { html, TemplateResult } from 'lit-element';
import { SitesTabComponent } from './sites-tab';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { SitesTabStyles } from './sites-tab.styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { TableStyles } from '../../../styles/table-styles';
import { leafletStyles } from '../../../styles/leaflet-styles';
import { TabInputsStyles } from '../../../styles/tab-inputs-styles';
import { translate } from '../../../../localization/localisation';
import { hasPermission, Permissions } from '../../../../config/permissions';

export function template(this: SitesTabComponent): TemplateResult {
    return html`
        ${SharedStyles} ${pageLayoutStyles} ${SitesTabStyles}
        ${FlexLayoutClasses} ${TableStyles} ${leafletStyles} ${TabInputsStyles}
       <section class="elevation page-content filters" elevation="1">
            <div class="layout horizontal">
                <paper-input
                        class="search-input"
                        type="search"
                        .value="${this.queryParams && this.queryParams.search || ''}"
                        placeholder="${ translate('SITES.PLACEHOLDERS.SEARCH') }"
                        @value-changed="${(event: CustomEvent) => this.searchKeyDown(event)}"
                        inline>
                    <iron-icon icon="search" slot="prefix"></iron-icon>
                </paper-input>

                <div class="toggle-button-control">
                    <paper-toggle-button .checked="${this.queryParams && this.queryParams.show_inactive || false}" @checked-changed="${(event: CustomEvent) => this.changeShowInactive(event)}"></paper-toggle-button>
                    <span>${ translate('SITES.SHOW_INACTIVE') }</span>
                </div>
            </div>
        </section>

         <section class="elevation page-content sites-table-section" elevation="1">

            <div class="table-title-block with-bottom-line">
                <div class="table-title">${ translate('SITES.TABLE_CAPTION') }</div>
                <div class="buttons-container">
                    <paper-icon-button
                            @tap="${(event: MouseEvent) => this.openDialog(event)}"
                            class="panel-button"
                            ?hidden="${!hasPermission(Permissions.EDIT_SITES)}"
                            data-type="add"
                            icon="add-box"></paper-icon-button>
                </div>
            </div>

            <etools-data-table-header id="listHeader"
                                      no-collapse no-title>
                <etools-data-table-column class="w30">
                    ${ translate('SITES.COLUMNS.ADMIN_LEVEL') }
                </etools-data-table-column>
                <etools-data-table-column class="w90px layout center-center">
                    ${ translate('SITES.COLUMNS.STATUS') }
                </etools-data-table-column>
                <etools-data-table-column class="w150px">
                    ${ translate('SITES.COLUMNS.NAME') }
                </etools-data-table-column>
            </etools-data-table-header>

            ${this.sites.map((parentLocation: IGroupedSites) => html`
                <etools-data-table-row no-collapse>
                        <div slot="row-data" class="layout horizontal editable-row parent-row">

                            <div class="col-data w30 layout vertical start center-justified flex-none">
                                <span class="admin-level-text">${this.getAdminLevel(parentLocation.gateway.admin_level)}</span>
                                <span>${parentLocation.name}</span>
                            </div>

                            <div class="sites-list">
                                ${parentLocation.sites.map((site: Site) => html`
                                    <div class="layout horizontal editable-row site-row center">
                                            <div class="col-data w90px layout center-center flex-none">
                                                <div class="active-marker ${this.getActiveClass(site.is_active)}"></div>
                                            </div>
                                            <div class="col-data flex-auto">${site.name}</div>

                                            <div class="hover-block" ?hidden="${!hasPermission(Permissions.EDIT_SITES)}">
                                                <iron-icon icon="icons:create" @tap="${(event: MouseEvent) => this.openDialog(event, site)}" data-type="edit"></iron-icon>
                                            </div>
                                        </div>
                                `)}
                            </div>


                        </div>
                    </etools-data-table-row>
            `)}

            ${ !this.sites.length ? html`
                <etools-data-table-row no-collapse>
                    <div slot="row-data" class="layout horizontal">
                        <div  class="col-data w30">-</div>
                        <div class="col-data w90px layout center-center">-</div>
                        <div class="col-data w150px">-</div>
                        <div class="col-data flex-auto">-</div>
                    </div>
                </etools-data-table-row>
            ` : '' }

            <etools-data-table-footer
                    .pageSize="${this.queryParams && this.queryParams.page_size || 0}"
                    .pageNumber="${this.queryParams && this.queryParams.page || 0}"
                    .totalResults="${this.count}"
                    @page-size-changed="${(event: CustomEvent) => this.pageSizeSelected(event)}"
                    @page-number-changed="${(event: CustomEvent) => this.pageNumberChanged(event)}">
            </etools-data-table-footer>
        </section>

        <etools-dialog
                size="md"
                id="dialog"
                .theme="${this.dialog && this.dialog.theme}"
                .backdrop="${false}"
                no-padding
                .opened="${this.dialog && this.dialog.opened}"
                .dialogTitle="${this.dialog && this.dialog.title}"
                keep-dialog-open
                @confirm-btn-clicked="${() => this.saveSite()}"
                @iron-overlay-closed="${(event: CustomEvent) => this.resetData(event)}"
                @iron-overlay-opened="${(event: CustomEvent) => this.mapInitialization(event)}"
                .okBtnText="${this.dialog && this.dialog.confirm}">
            <etools-loading
                    ?active="${this.savingInProcess}"
                    loading-text="${ translate('MAIN.SAVING_DATA_IN_PROCESS') }">
            </etools-loading>
            ${ this.isRemoveDialog(this.dialog && this.dialog.theme || '') ?
                html`<div class="remove-title">${ translate('SITES.REMOVE_CONFIRMATION') }</div>` :
                '' }

            <div class="container" ?hidden="${this.isRemoveDialog(this.dialog && this.dialog.theme || '')}">
                <div class="layout horizontal">

                    <paper-input
                            class="validate-input disabled-as-readonly flex-7"
                            .value="${this.selectedModel && this.selectedModel!.name}"
                            @value-changed="${({ detail }: CustomEvent) => this.updateModelValue('name', detail.value)}"
                            maxlength="100"
                            label="${ translate('SITES.LABELS.NAME') }"
                            placeholder="${ !hasPermission(Permissions.EDIT_SITES) ?
                                                translate('MAIN.EMPTY_FIELD') :
                                                translate('SITES.PLACEHOLDERS.NAME') }"
                            ?required="${ !hasPermission(Permissions.EDIT_SITES) }"
                            ?disabled="${ !hasPermission(Permissions.EDIT_SITES) }"
                            ?readonly="${ !hasPermission(Permissions.EDIT_SITES) }"
                            ?invalid="${this.errors && this.errors.name}"
                            .errorMessage="${this.errors && this.errors.name}"
                            on-focus="resetFieldError"
                            on-tap="resetFieldError"></paper-input>


                    <etools-dropdown
                            id="statusDropdown"
                            class="validate-input disabled-as-readonly flex-2"
                            .selected="${
                                this.setStatusValue(this.selectedModel && this.selectedModel.is_active || false)
                            }"
                            @etools-selected-item-changed="${({ detail }: CustomEvent) => this.updateModelValue('is_active', detail.selectedItem.value)}"
                            trigger-value-change-event
                            label="${ translate('SITES.LABELS.STATUS') }"
                            placeholder="${ !hasPermission(Permissions.EDIT_SITES) ?
                                                translate('MAIN.EMPTY_FIELD') :
                                                translate('SITES.PLACEHOLDERS.STATUS') }"
                            .options="${this.statusOptions}"
                            option-label="display_name"
                            option-value="id"
                            ?required="${ !hasPermission(Permissions.EDIT_SITES) }"
                            ?disabled="${ !hasPermission(Permissions.EDIT_SITES) }"
                            ?readonly="${ !hasPermission(Permissions.EDIT_SITES) }"
                            ?invalid="${this.errors && this.errors.is_active}"
                            .errorMessage="${this.errors && this.errors.is_active}"
                            on-focus="resetFieldError"
                            on-tap="resetFieldError"
                            allow-outside-scroll
                            dynamic-align></etools-dropdown>
                </div>

                ${ this.isEditDialog(this.dialog && this.dialog.type || '') ? html`
                 <paper-input
                            class="disabled-as-readonly"
                            .value="${this.selectedModel && this.selectedModel!.parent!.name}"
                            label="${ translate('SITES.LABELS.ADMIN_LOCATION') }"
                            placeholder="${ translate('SITES.PLACEHOLDERS.ADMIN_LOCATION') }"
                            disabled readonly></paper-input>
                ` : '' }


                <div class="map" id="map"></div>

                <div ?hidden="${!this.currentCoords}" class="current-coords">${ translate('SITES.SELECTED_SITE') }: ${this.currentCoords}</div>

        </etools-dialog>
    `;
}
