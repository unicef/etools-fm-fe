import '@unicef-polymer/etools-data-table';
import '@polymer/paper-toggle-button';
import { html, TemplateResult } from 'lit-element';
import { SitesTabComponent } from './sites-tab';
import { SharedStyles } from '../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../styles/page-layout-styles';
import { SitesTabStyles } from './sites-tab.styles';
import { FlexLayoutClasses } from '../../../styles/flex-layout-classes';
import { TableStyles } from '../../../styles/table-styles';

export function template(this: SitesTabComponent): TemplateResult {
    return html`
        ${SharedStyles} ${pageLayoutStyles} ${SitesTabStyles}
        ${FlexLayoutClasses} ${TableStyles}
       <section class="elevation page-content filters" elevation="1">
            <div class="layout horizontal">
                <paper-input
                        class="search-input"
                        type="search"
                        .value="${this.queryParams && this.queryParams.search || ''}"
                        placeholder="Search location or site"
                        @value-changed="${(event: CustomEvent) => this.searchKeyDown(event)}"
                        inline>
                    <iron-icon icon="search" slot="prefix"></iron-icon>
                </paper-input>

                <div class="toggle-button-control">
                    <paper-toggle-button .checked="${this.queryParams && this.queryParams.show_inactive || false}" @checked-changed="${(event: CustomEvent) => this.changeShowInactive(event)}"></paper-toggle-button>
                    <span>Show inactive sites</span>
                </div>
            </div>
        </section>

         <section class="elevation page-content sites-table-section" elevation="1">

            <div class="table-title-block with-bottom-line">
                <div class="table-title">Sites Locations</div>
                <div class="buttons-container">
                    <!--hidden$="[[isReadonlyCollection(permissions)]]"-->
                    <paper-icon-button
                            @tap="${(event: MouseEvent) => this.openDialog(event)}"
                            class="panel-button"
                            data-type="add"
                            icon="add-box"></paper-icon-button>
                </div>
            </div>

            <etools-data-table-header id="listHeader"
                                      no-collapse no-title>
                <etools-data-table-column class="w30">
                    Admin Level
                </etools-data-table-column>
                <etools-data-table-column class="w90px layout center-center">
                    Is Active
                </etools-data-table-column>
                <etools-data-table-column class="w150px">
                    Name
                </etools-data-table-column>
                <etools-data-table-column class="flex-auto">
                    Security Detail
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
                                            <div class="col-data w150px flex-none">${site.name}</div>
                                            <div class="col-data flex-auto security-detail"><span class="flexible-text">${site.security_detail}</span></div>

                                            <!--hidden$="[[isReadonlyCollection(permissions)]]"-->
                                            <div class="hover-block">
                                                <iron-icon icon="icons:create" @tap="${(event: MouseEvent) => this.openDialog(event)}" data-type="edit"></iron-icon>
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
                no-padding
                .opened="${this.dialog && this.dialog.opened}"
                .dialog-title="${this.dialog && this.dialog.title}"
                keep-dialog-open
                @confirm-btn-clicked="${() => this.saveSite()}"
                @iron-overlay-closed="${(event: CustomEvent) => this.resetData(event)}"
                @iron-overlay-opened="${(event: CustomEvent) => this.mapInitialization(event)}"
                .ok-btn-text="${this.dialog && this.dialog.confirm}">
            <etools-loading
                    .active="${this.savingInProcess}"
                    loading-text="Saving Data">
            </etools-loading>
            ${ this.isRemoveDialog(this.dialog && this.dialog.theme || '') ?
                html`<div class="remove-title">Are you sure that you want to delete this Site Specific Location?</div>` :
                '' }

            <div class="container" hidden="${this.isRemoveDialog(this.dialog && this.dialog.theme || '')}">
                <div class="layout horizontal">
                    <paper-input
                            class="validate-input disabled-as-readonly flex-7"
                            value="{{selectedModel.name}}"
                            maxlength="100"
                            label="[[getDescriptorLabel(permissions, 'name')]]"
                            placeholder="[[getPlaceholder(permissions, 'name', 'Enter')]]"
                            required$="[[getRequiredStatus(permissions, 'name')]]"
                            disabled$="[[getReadonlyStatus(permissions, 'name')]]"
                            readonly$="[[getReadonlyStatus(permissions, 'name')]]"
                            invalid="{{errors.name}}"
                            error-message="{{errors.name}}"
                            on-focus="resetFieldError"
                            on-tap="resetFieldError"></paper-input>

                    <!--<etools-dropdown-->
                            <!--id="statusDropdown"-->
                            <!--class="validate-input disabled-as-readonly flex-2"-->
                            <!--selected="[[setStatusValue(selectedModel.is_active)]]"-->
                            <!--label="[[getDescriptorLabel(permissions, 'is_active')]]"-->
                            <!--placeholder="[[getPlaceholder(permissions, 'is_active', 'Select')]]"-->
                            <!--options="[[statusOptions]]"-->
                            <!--option-label="display_name"-->
                            <!--option-value="id"-->
                            <!--required$="[[getRequiredStatus(permissions, 'is_active')]]"-->
                            <!--disabled$="[[getReadonlyStatus(permissions, 'is_active')]]"-->
                            <!--readonly$="[[getReadonlyStatus(permissions, 'is_active')]]"-->
                            <!--invalid="{{errors.is_active}}"-->
                            <!--error-message="{{errors.is_active}}"-->
                            <!--on-focus="resetFieldError"-->
                            <!--on-tap="resetFieldError"-->
                            <!--allow-outside-scroll-->
                            <!--dynamic-align></etools-dropdown>-->
                </div>

                <template is="dom-if" if="[[isEditDialog(dialog.type)]]">
                    <paper-input
                            class="disabled-as-readonly"
                            value="[[selectedModel.parent.name]]"
                            label="[[getDescriptorLabel(permissions, 'parent.name')]]"
                            placeholder="Empty Field"
                            disabled readonly></paper-input>
                </template>


                <div class="map" id="map"></div>

                <div hidden$="[[!currentCoords]]" class="current-coords">Selected site: [[currentCoords]]</div>

                <paper-textarea
                        class="validate-input disabled-as-readonly"
                        value="{{selectedModel.security_detail}}"
                        max-rows="3"
                        label="[[getDescriptorLabel(permissions, 'security_detail')]]"
                        placeholder="[[getPlaceholder(permissions, 'security_detail', 'Enter')]]"
                        required$="[[getRequiredStatus(permissions, 'security_detail')]]"
                        disabled$="[[getReadonlyStatus(permissions, 'security_detail')]]"
                        readonly$="[[getReadonlyStatus(permissions, 'security_detail')]]"
                        invalid="{{errors.security_detail}}"
                        error-message="{{errors.security_detail}}"
                        on-focus="resetFieldError"
                        on-tap="resetFieldError"></paper-textarea>
            </div>

        </etools-dialog>
    `;
}
