import {CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './activities-list.tpl';
import {elevationStyles} from '../../../styles/elevation-styles';
import {addTranslates, ENGLISH} from '../../../../localization/localisation';
import {ACTIVITIES_LIST_TRANSLATES} from '../../../../localization/en/activities-and-data-collection/activities-list.translates';
import {Unsubscribe} from 'redux';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {updateAppLocation, updateQueryParams} from '../../../../routing/routes';
import {debounce} from '../../../utils/debouncer';
import {fireEvent} from '../../../utils/fire-custom-event';
import {loadActivitiesList} from '../../../../redux/effects/activities.effects';
import {activities} from '../../../../redux/reducers/activities.reducer';
import {activitiesListData} from '../../../../redux/selectors/activities.selectors';
import {ROOT_PATH} from '../../../../config/config';
import {ACTIVITY_STATUSES, ACTIVITY_TYPES} from '../../../common/dropdown-options';
import {EtoolsFilterTypes, IEtoolsFilter} from '../../../common/layout/filters/etools-filters';
import {loadStaticData} from '../../../../redux/effects/load-static-data.effect';
import {mapFilters} from '../../../utils/filters-mapping';
import {activitiesListFilters} from './activities-list.filters';
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

addTranslates(ENGLISH, [ACTIVITIES_LIST_TRANSLATES]);
store.addReducers({activities, specificLocations});

@customElement('activities-list')
export class ActivitiesListComponent extends ListMixin<IListActivity>(LitElement) {
  @property() loadingInProcess: boolean = false;
  @property() rootPath: string = ROOT_PATH;
  @property() filtersLoading: boolean = false;
  @property() filters: IEtoolsFilter[] | null = null;

  activityTypes: DefaultDropdownOption<string>[] = ACTIVITY_TYPES;
  activityStatuses: DefaultDropdownOption<string>[] = ACTIVITY_STATUSES;

  private readonly routeDetailsUnsubscribe: Unsubscribe;
  private readonly activitiesDataUnsubscribe: Unsubscribe;
  private readonly debouncedLoading: Callback;
  private readonly filtersData: GenericObject = {
    activity_type: ACTIVITY_TYPES,
    status__in: ACTIVITY_STATUSES
  };

  constructor() {
    super();
    // List loading request
    this.debouncedLoading = debounce((params: IRouteQueryParam) => {
      this.loadingInProcess = true;
      store
        .dispatch<AsyncEffect>(loadActivitiesList(params))
        .catch(() => fireEvent(this, 'toast', {text: 'Can not load Activities List'}))
        .then(() => (this.loadingInProcess = false));
    }, 100);

    // route params listener
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false)
    );
    const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
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

    this.initFilters();
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
      ActivitiesListStyles
    ];
  }

  render(): TemplateResult {
    return template.call(this);
  }

  goNew(): void {
    updateAppLocation('activities/new');
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeDetailsUnsubscribe();
    this.activitiesDataUnsubscribe();
  }

  formatDate(date: string | null): string {
    return date ? moment(date).format('DD MMM YYYY') : '-';
  }

  serializeName(
    id: number | string,
    collection: GenericObject[],
    labelField: string = 'name',
    valueField: string = 'id'
  ): string {
    if (!id || !collection) {
      return '';
    }
    const item: GenericObject | undefined = collection.find(
      (collectionItem: GenericObject) => `${collectionItem[valueField]}` === `${id}`
    );
    return item ? item[labelField] : '';
  }

  private onRouteChange({routeName, subRouteName, queryParams}: IRouteDetails): void {
    if (!(routeName === 'activities' && subRouteName === 'list')) {
      return;
    }

    const paramsAreValid: boolean = this.checkParams(queryParams);
    if (paramsAreValid) {
      this.queryParams = queryParams;
      this.debouncedLoading(this.queryParams);
    }
  }

  private checkParams(params?: IRouteQueryParams | null): boolean {
    const invalid: boolean = !params || !params.page || !params.page_size;
    if (invalid) {
      const {page = 1, page_size = 10} = params || {};
      updateQueryParams({page, page_size});
    }
    return !invalid;
  }

  private initFilters(): void {
    this.filtersLoading = true;

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
    activitiesListFilters.forEach((filter: IEtoolsFilter) => {
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
          this.filtersData[filterKey] = data;
          this.setFilters(() => subscriber());
        },
        [dataPath]
      )
    );
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
      tpmPartners = 'tpmPartners'
    } = storeState.staticData;

    // if data isn't loaded it will be fallback to string and we need to run AsyncEffect
    [partners, interventions, outputs, users, tpmPartners].forEach((data: any) => {
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
    const allDataLoaded: boolean = activitiesListFilters.every(
      (filter: IEtoolsFilter) =>
        (filter.type !== EtoolsFilterTypes.Dropdown && filter.type !== EtoolsFilterTypes.DropdownMulti) ||
        Boolean(this.filtersData[filter.filterKey])
    );

    if (!allDataLoaded) {
      return;
    }

    const initialValues: GenericObject = store.getState().app.routeDetails.queryParams || {};
    this.filters = mapFilters(activitiesListFilters, this.filtersData, initialValues);

    this.filtersLoading = false;
  }
}
