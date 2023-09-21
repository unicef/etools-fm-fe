import {css, CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './activities-list.tpl';
import {elevationStyles} from '../../../styles/elevation-styles';
import {Unsubscribe} from 'redux';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {updateAppLocation, updateQueryParams} from '../../../../routing/routes';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {loadActivitiesList} from '../../../../redux/effects/activities.effects';
import {activities} from '../../../../redux/reducers/activities.reducer';
import {activitiesListData} from '../../../../redux/selectors/activities.selectors';
import {ROOT_PATH} from '../../../../config/config';
import {ACTIVITY_STATUSES, MONITOR_TYPES} from '../../../common/dropdown-options';
import {EtoolsFilterTypes, EtoolsFilter} from '@unicef-polymer/etools-filters/src/etools-filters';
import {updateFilterSelectionOptions, updateFiltersSelectedValues} from '@unicef-polymer/etools-filters/src/filters';
import {loadStaticData} from '../../../../redux/effects/load-static-data.effect';
import {getActivitiesFilters, ActivityFilter, ActivityFilterKeys} from './activities-list.filters';
import {staticDataDynamic} from '../../../../redux/selectors/static-data.selectors';
import {sitesSelector} from '../../../../redux/selectors/site-specific-locations.selectors';
import {loadSiteLocations} from '../../../../redux/effects/site-specific-locations.effects';
import {specificLocations} from '../../../../redux/reducers/site-specific-locations.reducer';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import {CardStyles} from '../../../styles/card-styles';
import {buttonsStyles} from '../../../styles/button-styles';
import {ActivitiesListStyles} from './activities-list.styles';
import {ListMixin} from '../../../common/mixins/list-mixin';
import {activityDetailsError} from '../../../../redux/selectors/activity-details.selectors';
import {activityDetails} from '../../../../redux/reducers/activity-details.reducer';
import {applyDropdownTranslation} from '../../../utils/translation-helper';
import {activeLanguageSelector} from '../../../../redux/selectors/active-language.selectors';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import '@unicef-polymer/etools-data-table/etools-data-table-footer';
import {get as getTranslation} from 'lit-translate';
import {waitForCondition} from '@unicef-polymer/etools-utils/dist/wait.util';
import {
  EtoolsRouteQueryParam,
  EtoolsRouteDetails,
  EtoolsRouteQueryParams
} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import uniqBy from 'lodash-es/uniqBy';
import {currentUser} from '../../../../redux/selectors/user.selectors';
import cloneDeep from 'lodash-es/cloneDeep';

store.addReducers({activities, specificLocations, activityDetails});

@customElement('activities-list')
export class ActivitiesListComponent extends MatomoMixin(ListMixin()<IListActivity>(LitElement)) {
  @property() loadingInProcess = false;
  @property() rootPath: string = ROOT_PATH;
  @property() filters: EtoolsFilter[] | null = null;
  @property() activitiesListFilters: ActivityFilter[] = [];
  @property({type: Object}) user!: IEtoolsUserModel;

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

  constructor() {
    super();
    // List loading request
    this.debouncedLoading = debounce((params: EtoolsRouteQueryParam) => {
      this.loadingInProcess = true;
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
          status__in: applyDropdownTranslation(ACTIVITY_STATUSES)
        };
        waitForCondition(() => !!this.user).then(() => {
          this.activitiesListFilters = getActivitiesFilters(this.user.is_unicef_user);
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
      FlexLayoutClasses,
      CardStyles,
      SharedStyles,
      buttonsStyles,
      ActivitiesListStyles,
      css`
        .search-container {
          display: flex;
          min-height: 73px;
        }
        .search-input {
          margin-right: 16px;
        }
        .search-filters {
          flex-grow: 1;
          margin-bottom: 11px;
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

  //fixme move common logic to utils function? (sites-tab)
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
    if (!(routeName === 'activities' && subRouteName === 'list')) {
      return;
    }

    const paramsAreValid: boolean = this.checkParams(queryParams);
    if (paramsAreValid) {
      this.queryParams = queryParams;
      this.debouncedLoading(this.queryParams);
    }
  }

  private checkParams(params?: EtoolsRouteQueryParams | null): boolean {
    const invalid: boolean = !params || !params.page || !params.page_size;
    if (invalid) {
      const {page = 1, page_size = 10} = params || {};
      updateQueryParams({page, page_size});
    }
    return !invalid;
  }

  private initFilters(): void {
    // subscribe on sites data
    const subscriber: Unsubscribe = store.subscribe(
      sitesSelector((sites: Site[] | null) => {
        if (!sites) {
          return;
        }
        this.filtersData['location_site__in'] = sites;
        this.setFilters(() => subscriber());
      })
    );

    // subscribe on static data
    this.activitiesListFilters.forEach((filter: ActivityFilter) => {
      if (!filter.selectionOptionsEndpoint) {
        return;
      }
      this.subscribeOnFilterData(filter.selectionOptionsEndpoint, filter.filterKey);
    });

    this.loadDataForFilters();
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

  private loadDataForFilters(): void {
    const storeState: IRootState = store.getState();
    if (!storeState.specificLocations.data) {
      store.dispatch<AsyncEffect>(loadSiteLocations());
    }

    // we don't need to load locations. they are loaded in appShell
    const {
      partners = 'partners',
      interventions = 'interventions',
      outputs = 'outputs',
      users = 'users',
      tpmPartners = 'tpmPartners',
      offices = 'offices',
      sections = 'sections'
    } = storeState.staticData;
    const dataToLoad = [users, tpmPartners, offices, sections];
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
        Boolean(this.filtersData[filter.filterKey])
    );
    if (!allDataLoaded) {
      return;
    }

    this.populateDropdownFilterOptions(this.filtersData, this.activitiesListFilters);

    const currentParams: GenericObject = store.getState().app.routeDetails.queryParams || {};
    this.filters = updateFiltersSelectedValues(currentParams, this.activitiesListFilters);
  }

  private populateDropdownFilterOptions(filtersData: GenericObject, activitiesListFilters: ActivityFilter[]): void {
    activitiesListFilters.forEach((filter: EtoolsFilter) => {
      if (filter.type === EtoolsFilterTypes.Dropdown || filter.type === EtoolsFilterTypes.DropdownMulti) {
        updateFilterSelectionOptions(activitiesListFilters, filter.filterKey, filtersData[filter.filterKey]);
      }
    });
  }
}
