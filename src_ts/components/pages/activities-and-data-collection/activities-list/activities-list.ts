import {css, LitElement, TemplateResult, CSSResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './activities-list.tpl';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {Unsubscribe} from 'redux';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {updateAppLocation, updateQueryParams} from '../../../../routing/routes';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {loadActivitiesList} from '../../../../redux/effects/activities.effects';
import {activities} from '../../../../redux/reducers/activities.reducer';
import {activitiesListData} from '../../../../redux/selectors/activities.selectors';
import {ACTIVITY_STATUSES, MONITOR_TYPES} from '../../../common/dropdown-options';
import {EtoolsFilterTypes, EtoolsFilter} from '@unicef-polymer/etools-unicef/src/etools-filters/etools-filters';
import {loadStaticData} from '../../../../redux/effects/load-static-data.effect';
import {
  getActivitiesFilters,
  ActivityFilter,
  ActivityFilterKeys,
  ActivitiesFiltersHelper
} from './activities-list.filters';
import {staticDataDynamic} from '../../../../redux/selectors/static-data.selectors';
import {loadSites} from '../../../../redux/effects/site-specific-locations.effects';
import {specificLocations} from '../../../../redux/reducers/site-specific-locations.reducer';
import {SharedStyles} from '../../../styles/shared-styles';
// eslint-disable-next-line
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../styles/card-styles';
import {ActivitiesListStyles} from './activities-list.styles';
import {ListMixin} from '../../../common/mixins/list-mixin';
import {activityDetailsError} from '../../../../redux/selectors/activity-details.selectors';
import {activityDetails} from '../../../../redux/reducers/activity-details.reducer';
import {applyDropdownTranslation} from '../../../utils/translation-helper';
import {activeLanguageSelector} from '../../../../redux/selectors/active-language.selectors';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table-footer';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {waitForCondition} from '@unicef-polymer/etools-utils/dist/wait.util';
import {
  EtoolsRouteQueryParam,
  EtoolsRouteDetails,
  EtoolsRouteQueryParams
} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import uniqBy from 'lodash-es/uniqBy';
import {currentUser} from '../../../../redux/selectors/user.selectors';
import cloneDeep from 'lodash-es/cloneDeep';
import {
  ACTIVE_STATUS_FILTER,
  DATA_COLLECTION,
  REPORT_FINALIZATION
} from '../activity-item/statuses-actions/activity-statuses';
import {COLLECT_TAB, DETAILS_TAB, SUMMARY_TAB} from '../activity-item/activities-tabs';
import {getDataFromSessionStorage, setDataOnSessionStorage} from '../../../utils/utils';
import {Environment} from '@unicef-polymer/etools-utils/dist/singleton/environment';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {ACTIVITIES_EXPORT} from '../../../../endpoints/endpoints-list';
import {EtoolsDropdownMulti} from '@unicef-polymer/etools-unicef/src/etools-dropdown/EtoolsDropdownMulti';
import {locationsInvert} from '../../management/sites/locations-invert';

store.addReducers({activities, specificLocations, activityDetails});

@customElement('activities-list')
export class ActivitiesListComponent extends MatomoMixin(ListMixin()<IListActivity>(LitElement)) {
  @property() loadingInProcess = false;
  @property() filters: EtoolsFilter[] | null = null;
  @property() activitiesListFilters: ActivityFilter[] = [];
  @property({type: Object}) user!: IEtoolsUserModel;
  @property({type: Boolean})
  lowResolutionLayout = false;
  @property() activityTypes: DefaultDropdownOption<string>[] = applyDropdownTranslation(MONITOR_TYPES);
  @property() activityStatuses: DefaultDropdownOption<string>[] = applyDropdownTranslation(ACTIVITY_STATUSES);
  @property() private filtersData: GenericObject = {
    monitor_type: applyDropdownTranslation(MONITOR_TYPES),
    status__in: applyDropdownTranslation(ACTIVITY_STATUSES)
  };

  private readonly routeDetailsUnsubscribe: Unsubscribe;
  private readonly activitiesDataUnsubscribe: Unsubscribe;
  private readonly activityErrorUnsubscribe: Unsubscribe;
  private readonly debouncedLoading: Callback;
  private readonly activeLanguageUnsubscribe: Unsubscribe;
  private readonly userUnsubscribe: Unsubscribe;
  private readonly prevQueryParamsKey = 'ActivitiesPrevParams';
  private siteFilterEl?: EtoolsDropdownMulti;
  @property({type: Object})
  loadSiteDropdownOptions!: (search: string, page: number, shownOptionsLimit: number) => void;
  @property() sitesOptions: Site[] = [];

  constructor() {
    super();
    // List loading request
    this.debouncedLoading = debounce((params: EtoolsRouteQueryParam) => {
      this.loadingInProcess = true;
      setDataOnSessionStorage(this.prevQueryParamsKey, params);
      store
        .dispatch<AsyncEffect>(loadActivitiesList(params))
        .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_LOAD_ACTIVITIES_LIST')}))
        .then(() => (this.loadingInProcess = false));
    }, 400);

    // route params listener
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector((details: EtoolsRouteDetails) => this.onRouteChange(details), false)
    );
    const currentRoute: EtoolsRouteDetails = (store.getState() as IRootState).app.routeDetails;
    this.onRouteChange(currentRoute);

    this.loadSiteDropdownOptions = this._loadSiteDropdownOptions.bind(this);

    // set activitiesList on store data changes
    this.activitiesDataUnsubscribe = store.subscribe(
      activitiesListData((data: IListData<IListActivity> | null) => {
        if (!data) {
          return;
        }
        this.count = data.count;
        this.items = data.results;
      }, false)
    );

    this.activityErrorUnsubscribe = store.subscribe(
      activityDetailsError((error: null | GenericObject) => {
        if (error) {
          fireEvent(this, 'toast', {text: getTranslation('ERROR_CREATE_ACTIVITY')});
        }
      }, false)
    );
    this.userUnsubscribe = store.subscribe(
      currentUser((user: IEtoolsUserModel | null) => {
        if (user) {
          this.user = user;
        }
      })
    );

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector((_lang: string) => {
        this.activityTypes = applyDropdownTranslation(MONITOR_TYPES);
        this.activityStatuses = applyDropdownTranslation(ACTIVITY_STATUSES);
        this.filtersData = {
          ...this.filtersData,
          monitor_type: applyDropdownTranslation(MONITOR_TYPES),
          status__in: applyDropdownTranslation(ACTIVITY_STATUSES),
          location_site__in: this.sitesOptions
        };
        waitForCondition(() => !!this.user).then(() => {
          this.activitiesListFilters = getActivitiesFilters(
            this.user.is_unicef_user,
            this.loadSiteDropdownOptions
          ) as any;
          this.initFilters();
        });
      })
    );
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      pageContentHeaderSlottedStyles,
      pageLayoutStyles,
      layoutStyles,
      CardStyles,
      SharedStyles,
      ActivitiesListStyles,
      css`
        .search-container {
          display: flex;
          min-height: 73px;
          position: relative;
          padding: 0 24px;
        }
        .search-input {
          margin-inline-end: 16px;
          align-items: center;
          display: flex;
        }
        .search-filters {
          flex-grow: 1;
          margin-block: 5px;
        }
        .row {
          width: 100%;
        }
      `
    ];
  }

  render(): TemplateResult {
    return template.call(this);
  }

  goNew(e: CustomEvent): void {
    this.trackAnalytics(e);
    updateAppLocation(`activities/new`);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeDetailsUnsubscribe();
    this.activitiesDataUnsubscribe();
    this.activityErrorUnsubscribe();
    this.activeLanguageUnsubscribe();
    this.userUnsubscribe();
  }

  serializeName(id: number | string, collection: GenericObject[], labelField = 'name', valueField = 'id'): string {
    if (!id || !collection) {
      return '';
    }
    const item: GenericObject | undefined = collection.find(
      (collectionItem: GenericObject) => `${collectionItem[valueField]}` === `${id}`
    );
    return item ? item[labelField] : '';
  }

  // fixme move common logic to utils function? (sites-tab)
  searchKeyDown({detail}: CustomEvent): void {
    const {value} = detail;
    const currentValue: number | string = (this.queryParams && this.queryParams.search) || 0;
    if (value === null || value === currentValue || value === undefined) {
      return;
    }

    if (!value.length) {
      updateQueryParams({search: null});
    }
    if (value.length > 1) {
      updateQueryParams({search: value, page: 1});
    }
  }

  filtersChange(e: CustomEvent): void {
    updateQueryParams({...e.detail, page: 1}, true);
  }

  private onRouteChange({routeName, subRouteName, queryParams}: EtoolsRouteDetails): void {
    if (!(routeName === 'activities-and-data-collection' && subRouteName === 'activities-list')) {
      return;
    }

    this.restoreFiltersIfComingBackToPage(queryParams);

    const paramsAreValid: boolean = this.checkParams(queryParams);
    if (paramsAreValid) {
      this.queryParams = queryParams;
      this.debouncedLoading(this.queryParams);
    }
  }

  private restoreFiltersIfComingBackToPage(queryParams: EtoolsRouteQueryParams | null) {
    const prevQueryParams = getDataFromSessionStorage(this.prevQueryParamsKey) as EtoolsRouteQueryParams | null;
    if (!Object.keys(queryParams || {}).length && prevQueryParams) {
      queryParams = {...prevQueryParams};
      updateQueryParams(queryParams);
    }
  }

  private checkParams(params?: EtoolsRouteQueryParams | null): boolean {
    const invalid: boolean = !params || !params.page || !params.page_size || !params.status__in;
    if (invalid) {
      const {page = 1, page_size = 10, status__in = ACTIVE_STATUS_FILTER} = params || {};
      updateQueryParams({page, page_size, status__in});
    }
    return !invalid;
  }

  exportData(e: CustomEvent): void {
    this.trackAnalytics(e);
    const url: string = getEndpoint(ACTIVITIES_EXPORT).url;
    const routeDetails: EtoolsRouteDetails | null = EtoolsRouter.getRouteDetails();
    const params: string =
      routeDetails && routeDetails.queryParams ? `?${EtoolsRouter.encodeQueryParams(routeDetails.queryParams)}` : '';
    window.open(url + params, '_blank');
  }

  private initFilters(): void {
    // subscribe on static data
    this.activitiesListFilters.forEach((filter: ActivityFilter) => {
      if (!filter.selectionOptionsEndpoint) {
        return;
      }
      this.subscribeOnFilterData(filter.selectionOptionsEndpoint, filter.filterKey);
    });

    this.loadDataForFilters();
  }

  async _loadSiteDropdownOptions(search: string, page: number, shownOptionsLimit: number) {
    const params = {search: search, page: page, page_size: shownOptionsLimit, is_active: true};
    if (!this.sitesOptions || page == 1) {
      this.sitesOptions = [];
    }
    if (!this.siteFilterEl) {
      const filtersEl = this.shadowRoot?.querySelector('etools-filters');
      if (filtersEl) {
        this.siteFilterEl = filtersEl.shadowRoot?.querySelector('#location_site__in') as EtoolsDropdownMulti;
      }
      if (!this.siteFilterEl) {
        return;
      }
    }

    const resp = await loadSites(params);
    const sites = locationsInvert(resp.results)
      .map((location: IGroupedSites) => location.sites)
      .reduce((allSites: Site[], currentSites: Site[]) => [...allSites, ...currentSites], []);

    this.sitesOptions = this.sitesOptions.concat(sites);
    this.siteFilterEl.options = this.sitesOptions;
    this.filtersData = {...this.filtersData, location_site__in: this.sitesOptions};
    const f = this.activitiesListFilters.find((x) => x.filterKey === ActivityFilterKeys.location_site__in);
    if (f) {
      f.selectionOptions = this.sitesOptions;
    }
    this.siteFilterEl.requestUpdate();
  }

  private subscribeOnFilterData(dataPath: string, filterKey: string): void {
    const subscriber: Unsubscribe = store.subscribe(
      staticDataDynamic(
        (data: any[] | undefined) => {
          if (!data) {
            return;
          }
          this.setFiltersData(data, filterKey);
          this.setFilters(() => subscriber());
        },
        [dataPath]
      )
    );
  }

  setFiltersData(data: any[], filterKey: string): void {
    if (this.handledDuplicatesForTeamMembersAndVisitLead(data, filterKey)) {
      return;
    } else {
      this.filtersData[filterKey] = data;
    }
  }

  handledDuplicatesForTeamMembersAndVisitLead(data: any[], filterKey: string): boolean {
    // @ts-ignore
    if ([ActivityFilterKeys.team_members__in, ActivityFilterKeys.visit_lead__in].includes(filterKey)) {
      if (
        // Avoid filtering twice as there can be > 1000 users
        !this.filtersData[ActivityFilterKeys.team_members__in] ||
        !this.filtersData[ActivityFilterKeys.team_members__in]?.length
      ) {
        const unpefixedUniqueUsers = cloneDeep(uniqBy(data, 'id')).map((u) => {
          if (u.name.indexOf(']')) {
            u.name = u.name.substring(u.name.indexOf(']') + 1)?.trim();
            return u;
          }
        });
        this.filtersData[ActivityFilterKeys.team_members__in] = unpefixedUniqueUsers;
        this.filtersData[ActivityFilterKeys.visit_lead__in] = unpefixedUniqueUsers;
      }
      return true;
    }
    return false;
  }

  getActivityDetailsLink(activity: IListActivity): string {
    let tab = DETAILS_TAB;
    if (activity.status === DATA_COLLECTION) {
      tab = COLLECT_TAB;
    } else if (activity.status === REPORT_FINALIZATION) {
      tab = SUMMARY_TAB;
    }
    return `${Environment.basePath}activities/${activity.id}/${tab}/`;
  }

  private loadDataForFilters(): void {
    const storeState: IRootState = store.getState();
    // we don't need to load locations(loaded in appShell) and users (loaded in activities-page)
    const {
      partners = 'partners',
      interventions = 'interventions',
      outputs = 'outputs',
      tpmPartners = 'tpmPartners',
      offices = 'offices',
      sections = 'sections'
    } = storeState.staticData;
    const dataToLoad = [tpmPartners, offices, sections];
    if (this.user?.is_unicef_user) {
      dataToLoad.push(...[partners, outputs, interventions]);
    }

    // if data isn't loaded it will be fallback to string and we need to run AsyncEffect
    dataToLoad.forEach((data: any) => {
      if (typeof data === 'string') {
        store.dispatch<AsyncEffect>(loadStaticData(data as keyof IStaticDataState));
      }
    });
  }

  private setFilters(unsubscribe?: Unsubscribe): void {
    if (unsubscribe) {
      // unsubscribe after method initialization complete
      setTimeout(unsubscribe, 0);
    }
    // check that data for all dropdowns is loaded
    const allDataLoaded: boolean = this.activitiesListFilters.every(
      (filter: EtoolsFilter) =>
        (filter.type !== EtoolsFilterTypes.Dropdown && filter.type !== EtoolsFilterTypes.DropdownMulti) ||
        Boolean(this.filtersData[filter.filterKey] || filter.filterKey === ActivityFilterKeys.location_site__in)
    );
    if (!allDataLoaded) {
      return;
    }

    this.populateDropdownFilterOptions(this.filtersData, this.activitiesListFilters);
    const selectedFilters =
      (this.filters || this.activitiesListFilters)
        ?.filter((filter) => filter.selected)
        .map((filter) => filter.filterKey) || [];
    const currentParams: GenericObject = store.getState().app.routeDetails.queryParams || {};
    this.filters = ActivitiesFiltersHelper.updateFiltersSelectedValues(currentParams, this.activitiesListFilters);
    this.filters.forEach((filter) => {
      filter.selected = filter.selected || selectedFilters?.indexOf(filter.filterKey) > -1;
    });
  }

  private populateDropdownFilterOptions(filtersData: GenericObject, activitiesListFilters: ActivityFilter[]): void {
    activitiesListFilters.forEach((filter: EtoolsFilter) => {
      if (filter.type === EtoolsFilterTypes.Dropdown || filter.type === EtoolsFilterTypes.DropdownMulti) {
        ActivitiesFiltersHelper.updateFilterSelectionOptions(
          activitiesListFilters,
          filter.filterKey,
          filtersData[filter.filterKey]
        );
      }
    });
  }
}
