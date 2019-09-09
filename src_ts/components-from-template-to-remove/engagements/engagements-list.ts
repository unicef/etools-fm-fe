import '@polymer/paper-button/paper-button';
import { CSSResult, customElement, html, LitElement, property, TemplateResult } from 'lit-element';
import { connect } from 'pwa-helpers/connect-mixin';
import { store } from '../../redux/store';

import { SharedStyles } from '../../components/styles/shared-styles';
import '../../components/common/layout/page-content-header/page-content-header';
import { pageContentHeaderSlottedStyles }
  from '../../common/layout/page-content-header/page-content-header-slotted-styles';

import { pageLayoutStyles } from '../../styles/page-layout-styles';

import '../../common/layout/filters/etools-filters';
import { IEtoolsFilter } from '../../common/layout/filters/etools-filters';
import { ROOT_PATH } from '../../../config/config';
import { elevationStyles } from '../../styles/lit-styles/elevation-styles';
import '../../common/layout/etools-table/etools-table';
import { defaultPaginator, getPaginator, IEtoolsPaginator } from '../../common/layout/etools-table/pagination/paginator';
import {
  buildUrlQueryString,
  getSelectedFiltersFromUrlParams, getSortFields,
  getSortFieldsFromUrlSortParams, getUrlQueryStringSort,
  IEtoolsTableSortItem
} from '../../common/layout/etools-table/etools-table-utility';

import { defaultSelectedFilters, engagementsFilters, updateFiltersSelectedValues } from './list/filters';
import { updateAppLocation } from '../../../routing/routes';
import { getListDummydata } from './list/list-dummy-data';
import { buttonsStyles } from '../../styles/button-styles';
import { fireEvent } from '../../utils/fire-custom-event';
import {
  EtoolsTableColumnSort,
  EtoolsTableColumnType,
  IEtoolsTableColumn
} from '../../common/layout/etools-table/etools-table';

/**
 * @LitElement
 * @customElement
 */
@customElement('engagements-list')
export class EngagementsList extends connect(store)(LitElement) {

  public static get styles(): CSSResult[] {
    return [elevationStyles];
  }

  /**
   * TODO:
   *  1. init filters and sort params: default values or values from routeDetails object
   *  2. make engagements data request using filters and sorting params
   *  3. on engagements req success init paginator, list page data and update url params if needed
   *  4. on filters-change, parinator-change, sort-change trigger a new request for engagements data (repeat 2 and 3)
   *  5. add loading...
   *  6. hide etools-pagination if there are fewer results then first page_size option
   *  7. when navigating from details page to list all list req params are preserved and we need to avoid
   *  a duplicated request to get data. This can be done by adding a new list queryParams state in redux
   *  and use it in app-menu component to update menu option url
   *  8. test filters menu and prevend request triggered by filter select only action
   */

  @property({ type: Object })
  public routeDetails!: IRouteDetails;

  @property({ type: String })
  public rootPath: string = ROOT_PATH;

  @property({ type: Object })
  public paginator: IEtoolsPaginator = { ...defaultPaginator };

  @property({ type: Object })
  public sort: IEtoolsTableSortItem[] = [{ name: 'ref_number', sort: EtoolsTableColumnSort.Desc }];

  @property({ type: Array })
  public filters: IEtoolsFilter[] = [...engagementsFilters];

  @property({ type: Array })
  public selectedFilters: GenericObject = { ...defaultSelectedFilters };

  @property({ type: Array })
  public listColumns: IEtoolsTableColumn[] = [
    {
      label: 'Reference No.',
      name: 'ref_number',
      link_tmpl: `${ROOT_PATH}engagements/:id/details`,
      type: EtoolsTableColumnType.Link
    },
    {
      label: 'Assessment Date',
      name: 'assessment_date',
      type: EtoolsTableColumnType.Date,
      sort: EtoolsTableColumnSort.Desc
    },
    {
      label: 'Partner Org',
      name: 'partner_name',
      type: EtoolsTableColumnType.Text,
      sort: EtoolsTableColumnSort.Asc
    },
    {
      label: 'Status',
      name: 'status',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'Assessor',
      name: 'assessor',
      type: EtoolsTableColumnType.Text
    },
    {
      label: 'Rating',
      name: 'rating',
      type: EtoolsTableColumnType.Text
    }
  ];

  @property({ type: Array })
  public listData: GenericObject[] = [];

  public render(): TemplateResult {
    // main template
    // language=HTML
    return html`
      ${SharedStyles} ${pageContentHeaderSlottedStyles} ${pageLayoutStyles} ${buttonsStyles}
      <style>
        etools-table {
          padding-top: 12px;
        }
      </style>
      <page-content-header>
        <h1 slot="page-title">Engagements list</h1>
        <div slot="title-row-actions" class="content-header-actions">
          <paper-button class="default left-icon" raised @tap="${this.exportEngagements}">
            <iron-icon icon="file-download"></iron-icon>Export
          </paper-button>

          <paper-button class="primary left-icon" raised @tap="${this.goToAddnewPage}">
            <iron-icon icon="add"></iron-icon>Add new engagement
          </paper-button>
        </div>
      </page-content-header>

      <section class="elevation page-content filters" elevation="1">
        <etools-filters .filters="${this.filters}"
                        @filter-change="${this.filtersChange}"></etools-filters>
      </section>

      <section class="elevation page-content no-padding" elevation="1">
        <etools-table caption="Engagements list - optional table title"
                      .columns="${this.listColumns}"
                      .items="${this.listData}"
                      .paginator="${this.paginator}"
                      @paginator-change="${this.paginatorChange}"
                      @sort-change="${this.sortChange}"></etools-table>
      </section>
    `;
  }

  public stateChanged(state: IRootState): void {
    if (state.app!.routeDetails.routeName === 'engagements' &&
        state.app!.routeDetails.subRouteName === 'list') {

      const stateRouteDetails: IRouteDetails = { ...state.app!.routeDetails };
      if (JSON.stringify(stateRouteDetails) !== JSON.stringify(this.routeDetails)) {
        this.routeDetails = stateRouteDetails;
        console.log('new engagements list route details...', this.routeDetails);

        if (!this.routeDetails.queryParams || Object.keys(this.routeDetails.queryParams).length === 0) {
          // update url with params
          this.updateUrlListQueryParams();
          return;
        } else {
          // init filters, sort, page, page_size from url params
          this.updateListParamsFromRouteDetails(this.routeDetails.queryParams);
          this.getEngagementsData();
        }
      }
    }
    // common data used for filter options should update without page restriction
    // TODO: init filters options here!
  }

  public updateUrlListQueryParams(): void {
    const params: GenericObject = {
      ...this.selectedFilters,
      page: this.paginator.page,
      page_size: this.paginator.page_size,
      sort: getUrlQueryStringSort(this.sort)
    };
    const qs: string = buildUrlQueryString(params);
    updateAppLocation(`${this.routeDetails.path}?${qs}`, true);
  }

  public updateListParamsFromRouteDetails(queryParams: IRouteQueryParams): void {
    // update sort fields
    if (queryParams.sort) {
      this.sort = getSortFieldsFromUrlSortParams(queryParams.sort);
    }

    // update paginator fields
    const paginatorParams: GenericObject = {};
    if (queryParams.page) {
      paginatorParams.page = Number(queryParams.page);
    }
    if (queryParams.page_size) {
      paginatorParams.page_size = Number(queryParams.page_size);
    }
    this.paginator = { ...this.paginator, ...paginatorParams };

    // update filters
    this.selectedFilters = getSelectedFiltersFromUrlParams(this.selectedFilters, queryParams);
    this.filters = updateFiltersSelectedValues(this.selectedFilters, this.filters);
  }

  public connectedCallback(): void {
    super.connectedCallback();
    // TODO: remove method, might not be needed
    console.log('filters, sort, paginator initialized, engagements list attached...');
  }

  public filtersChange(e: CustomEvent): void {
    console.log('filters change event handling...', e.detail);
    this.selectedFilters = { ...this.selectedFilters, ...e.detail };
    this.updateUrlListQueryParams();
  }

  public paginatorChange(e: CustomEvent): void {
    const newPaginator: IEtoolsPaginator = { ...e.detail };
    console.log('paginator change: ', newPaginator);
    this.paginator = newPaginator;
    this.updateUrlListQueryParams();
  }

  public sortChange(e: CustomEvent): void {
    console.log('sorting has changed...', e.detail);
    this.sort = getSortFields(e.detail);
    this.updateUrlListQueryParams();
  }

  /**
   * This method runs each time new data is received from routeDetails state
   * (sort, filters, paginator init/change)
   */
  public getEngagementsData(): void {
    /**
     * TODO:
     *  - replace getListDummydata with the request to /engagements/list endpoint
     *  - include in req params filters, sort, page, page_size
     */
    // const requestParams = {
    //   ...this.selectedFilters,
    //   page: this.paginator.page,
    //   page_size: this.paginator.page_size,
    //   sort: this.sort
    // };
    console.log('get engagements data...');
    getListDummydata(this.paginator).then((response: any) => {
      // update paginator (total_pages, visible_range, count...)
      this.paginator = getPaginator(this.paginator, response);
      this.listData = [...response.results];
    }).catch((err: any) => {
      // TODO: handle req errors
      console.error(err);
    });
  }

  public exportEngagements(): void {
    // const exportParams = {
    //   ...this.selectedFilters
    // };

    // TODO: implement export using API endpoint
    fireEvent(this, 'toast', { text: 'Not implemented... waiting for API...' });
  }

  public goToAddnewPage(): void {
    updateAppLocation('/engagements/new/details', true);
  }
}
