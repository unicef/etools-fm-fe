import { ActivitiesPageComponent } from './activities-page';
import { html, TemplateResult } from 'lit-element';
import { SharedStyles } from '../../styles/shared-styles';
import { pageContentHeaderSlottedStyles } from '../../common/layout/page-content-header/page-content-header-slotted-styles';
import { pageLayoutStyles } from '../../styles/page-layout-styles';
import { buttonsStyles } from '../../styles/button-styles';
import '../../common/layout/page-content-header/page-content-header';
import '@unicef-polymer/etools-data-table';
import { translate } from '../../../localization/localisation';
import { FlexLayoutClasses } from '../../styles/flex-layout-classes';
import { TableStyles } from '../../styles/table-styles';
import { ActivitiesListStyles } from './activities-page.styles';

export function template(this: ActivitiesPageComponent): TemplateResult {
    return html`
        ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles}
        ${buttonsStyles} ${FlexLayoutClasses} ${TableStyles} ${ActivitiesListStyles}

        <page-content-header with-tabs-visible>
            <h1 slot="page-title">Activities</h1>
        </page-content-header>

        <!-- Table -->
        <section class="elevation page-content table-container activities-table-section" elevation="1">

            <!-- Spinner -->
            <etools-loading ?active="${ this.loadingInProcess }" loading-text="${ translate('MAIN.LOADING_DATA_IN_PROCESS') }"></etools-loading>


            <!-- Table Header -->
            <etools-data-table-header no-title no-collapse>
                <etools-data-table-column class="col-data flex-none w120px">
                    ${ translate('ACTIVITIES_LIST.COLUMNS.REFERENCE_NUMBER') }
                </etools-data-table-column>
                <etools-data-table-column class="col-data flex-none w100px">
                    ${ translate('ACTIVITIES_LIST.COLUMNS.START_DATE') }
                </etools-data-table-column>
                <etools-data-table-column class="col-data flex-1">
                    ${ translate('ACTIVITIES_LIST.COLUMNS.LOCATION_AND_SITE') }
                </etools-data-table-column>
                <etools-data-table-column class="col-data flex-none w80px">
                    ${ translate('ACTIVITIES_LIST.COLUMNS.ACTIVITY_TYPE') }
                </etools-data-table-column>
                <etools-data-table-column class="col-data flex-2">
                    ${ translate('ACTIVITIES_LIST.COLUMNS.TEAM_MEMBERS') }
                </etools-data-table-column>
                <etools-data-table-column class="col-data flex-none w60px">
                    ${ translate('ACTIVITIES_LIST.COLUMNS.CHECKLISTS_COUNT') }
                </etools-data-table-column>
                <etools-data-table-column class="col-data flex-none w80px">
                    ${ translate('ACTIVITIES_LIST.COLUMNS.STATUS') }
                </etools-data-table-column>
            </etools-data-table-header>


            <!-- Table Empty Row -->
            ${ !this.activitiesList.length ? html`
                <etools-data-table-row no-collapse>
                    <div slot="row-data" class="layout horizontal editable-row flex">
                        <div class="col-data flex-none w120px">-</div>
                        <div class="col-data flex-none w100px">-</div>
                        <div class="col-data flex-1">-</div>
                        <div class="col-data flex-none w80px">-</div>
                        <div class="col-data flex-2">-</div>
                        <div class="col-data flex-none w60px">-</div>
                        <div class="col-data flex-none w80px">-</div>
                    </div>
                </etools-data-table-row>
            ` : '' }

            <!-- Table Row items -->
            ${ this.activitiesList.map((activity: IListActivity) => html`
                <etools-data-table-row no-collapse>
                    <div slot="row-data" class="layout horizontal editable-row flex">
                        <div class="col-data flex-none w120px">${ activity.reference_number }</div>
                        <div class="col-data flex-none w100px">${ activity.start_date }</div>
                        <div class="col-data flex-1">${ activity.location.name } ${ activity.location_site ? `[${activity.location_site}]` : '' }</div>
                        <div class="col-data flex-none w80px">${ activity.activity_type }</div>
                        <div class="col-data flex-2">-</div>
                        <div class="col-data flex-none w60px">${ activity.checklists_count }</div>
                        <div class="col-data flex-none w80px">${ activity.status }</div>
                    </div>
                </etools-data-table-row>
            `) }


            <!-- Table Paginator -->
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
