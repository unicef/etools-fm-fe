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
                        .value="${this.queryParams && this.queryParams.search}"
                        placeholder="${ translate('SITES.PLACEHOLDERS.SEARCH') }"
                        @value-changed="${(event: CustomEvent) => this.searchKeyDown(event)}"
                        inline>
                    <iron-icon icon="search" slot="prefix"></iron-icon>
                </paper-input>

                <div class="toggle-button-control">
                    <paper-toggle-button .checked="${this.queryParams && this.queryParams.show_inactive}" @checked-changed="${(event: CustomEvent) => this.changeShowInactive(event)}"></paper-toggle-button>
                    <span>${ translate('SITES.SHOW_INACTIVE') }</span>
                </div>
            </div>
        </section>

         <section class="elevation page-content sites-table-section" elevation="1">

            <!-- Spinner -->
            <etools-loading ?active="${ this.listLoadingInProcess }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>

            <div class="table-title-block with-bottom-line">
                <div class="table-title">${ translate('SITES.TABLE_CAPTION') }</div>
                <div class="buttons-container">
                    <paper-icon-button
                            @tap="${() => this.openDialog()}"
                            class="panel-button"
                            ?hidden="${!hasPermission(Permissions.EDIT_SITES)}"
                            icon="add-box"></paper-icon-button>
                </div>
            </div>

            <etools-data-table-header id="listHeader"
                                      no-collapse no-title>
                <etools-data-table-column class="w30 col-data">
                    ${ translate('SITES.COLUMNS.ADMIN_LEVEL') }
                </etools-data-table-column>
                <etools-data-table-column class="w90px col-data layout center-center">
                    ${ translate('SITES.COLUMNS.STATUS') }
                </etools-data-table-column>
                <etools-data-table-column class="flex-auto col-data">
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
                                                <iron-icon icon="icons:create" @tap="${() => this.openDialog(site)}" data-type="edit"></iron-icon>
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
                    .pageSize="${this.queryParams && this.queryParams.page_size || undefined}"
                    .pageNumber="${this.queryParams && this.queryParams.page || undefined}"
                    .totalResults="${this.count}"
                    @page-size-changed="${(event: CustomEvent) => this.pageSizeSelected(event)}"
                    @page-number-changed="${(event: CustomEvent) => this.pageNumberChanged(event)}">
            </etools-data-table-footer>
        </section>
    `;
}