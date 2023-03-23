import {css, CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './partners-list.tpl';
import {elevationStyles} from '../../../styles/elevation-styles';
import {Unsubscribe} from 'redux';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {EtoolsRouter, updateQueryParams} from '../../../../routing/routes';
import {debounce} from '../../../utils/debouncer';
import {fireEvent} from '../../../utils/fire-custom-event';
import {loadPartnersList} from '../../../../redux/effects/tpm-partners.effects';
import {tpmPartners} from '../../../../redux/reducers/tpm-partners.reducer';
import {tpmPartnersListData} from '../../../../redux/selectors/tpm-partners.selectors';
import {ROOT_PATH} from '../../../../config/config';
import {ACTIVITY_STATUSES, MONITOR_TYPES} from '../../../common/dropdown-options';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import {CardStyles} from '../../../styles/card-styles';
import {buttonsStyles} from '../../../styles/button-styles';
import {ListMixin} from '../../../common/mixins/list-mixin';
import {applyDropdownTranslation} from '../../../utils/translation-helper';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import '@unicef-polymer/etools-data-table/etools-data-table-footer';
import {get as getTranslation} from 'lit-translate';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {TPM_PARTNERS_EXPORT} from '../../../../endpoints/endpoints-list';
import {openDialog} from '../../../utils/dialog';
import '../list/add-new-vendor/add-new-vendor-popup';

store.addReducers({tpmPartners});

@customElement('partners-list')
export class PartnersListComponent extends MatomoMixin(ListMixin()<IActivityTpmPartner>(LitElement)) {
  @property() loadingInProcess = false;
  @property() rootPath: string = ROOT_PATH;

  @property() activityTypes: DefaultDropdownOption<string>[] = applyDropdownTranslation(MONITOR_TYPES);
  @property() activityStatuses: DefaultDropdownOption<string>[] = applyDropdownTranslation(ACTIVITY_STATUSES);

  private readonly routeDetailsUnsubscribe: Unsubscribe;
  private readonly partnersDataUnsubscribe: Unsubscribe;
  private readonly debouncedLoading: Callback;

  constructor() {
    super();
    // List loading request
    this.debouncedLoading = debounce((params: IRouteQueryParam) => {
      this.loadingInProcess = true;
      store
        .dispatch<AsyncEffect>(loadPartnersList(params, !this.count))
        .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_LOAD_ACTIVITIES_LIST')}))
        .then(() => (this.loadingInProcess = false));
    }, 400);

    // route params listener
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false)
    );
    this.addEventListener('sort-changed', ((event: CustomEvent<SortDetails>) => this.changeSort(event.detail)) as any);
    const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
    this.onRouteChange(currentRoute);

    // set partnersList on store data changes
    this.partnersDataUnsubscribe = store.subscribe(
      tpmPartnersListData((data: IListData<IActivityTpmPartner> | null) => {
        if (!data) {
          return;
        }
        this.count = data.count;
        this.items = data.results;
      }, false)
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
      css`
        .search-container {
          display: flex;
          min-height: 73px;
        }
        .search-input {
          margin-right: 16px;
          min-width: 240px;
        }
        .search-filters {
          flex-grow: 1;
          margin-bottom: 11px;
        }
        .primary-btn {
          background-color: var(--green-color);
          font-weight: 500;
          color: white;
        }
        .with-prefix {
          padding-inline-end: 0;
          padding-inline-start: 18px;
          padding-inline-end: 18px;
        }
      `
    ];
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.routeDetailsUnsubscribe();
    this.partnersDataUnsubscribe();
  }

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

  export(e: any): void {
    e.currentTarget.blur();
    this.trackAnalytics(e);
    const url: string = getEndpoint(TPM_PARTNERS_EXPORT).url;
    const routeDetails: IRouteDetails | null = EtoolsRouter.getRouteDetails();
    const params: string = routeDetails && routeDetails.queryParamsString ? `?${routeDetails.queryParamsString}` : '';
    window.open(url + params, '_blank');
  }

  async openAddDialog(): Promise<void> {
    const confirmed = await openDialog<IActivityTpmPartnerExtended>({
      dialog: 'add-new-vendor-popup',
      dialogData: {permissions: store.getState().tpmPartners.permissions} as any
    }).then(({confirmed}: IDialogResponse<any>) => {
      return confirmed;
    });
    if (confirmed) {
      this.debouncedLoading(this.queryParams);
    }
  }

  private onRouteChange({routeName, subRouteName, queryParams}: IRouteDetails): void {
    if (!(routeName === 'partners' && subRouteName === 'list')) {
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
}
