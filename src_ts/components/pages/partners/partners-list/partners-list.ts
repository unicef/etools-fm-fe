import {css, CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './partners-list.tpl';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {Unsubscribe} from 'redux';
import {store} from '../../../../redux/store';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {updateQueryParams} from '../../../../routing/routes';
import {EtoolsRouter} from '@unicef-polymer/etools-utils/dist/singleton/router';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {loadPartnersList} from '../../../../redux/effects/tpm-partners.effects';
import {tpmPartners} from '../../../../redux/reducers/tpm-partners.reducer';
import {tpmPartnersListData, tpmPartnersPermissions} from '../../../../redux/selectors/tpm-partners.selectors';
import {ACTIVITY_STATUSES, MONITOR_TYPES} from '../../../common/dropdown-options';
import {SharedStyles} from '../../../styles/shared-styles';
// eslint-disable-next-line
import {pageContentHeaderSlottedStyles} from '../../../common/layout/page-content-header/page-content-header-slotted-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../styles/card-styles';

import {ListMixin} from '../../../common/mixins/list-mixin';
import {applyDropdownTranslation} from '../../../utils/translation-helper';
import MatomoMixin from '@unicef-polymer/etools-piwik-analytics/matomo-mixin';
import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table-footer';
import {get as getTranslation} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {getEndpoint} from '../../../../endpoints/endpoints';
import {TPM_PARTNERS_EXPORT} from '../../../../endpoints/endpoints-list';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import './add-new-vendor/add-new-vendor-popup';
import {
  EtoolsRouteDetails,
  EtoolsRouteQueryParam,
  EtoolsRouteQueryParams
} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';
import {canAdd} from '../../../utils/utils';

store.addReducers({tpmPartners});

@customElement('partners-list')
export class PartnersListComponent extends MatomoMixin(ListMixin()<IActivityTpmPartner>(LitElement)) {
  @property() loadingInProcess = false;
  @property() showAddButton = false;

  @property() activityTypes: DefaultDropdownOption<string>[] = applyDropdownTranslation(MONITOR_TYPES);
  @property() activityStatuses: DefaultDropdownOption<string>[] = applyDropdownTranslation(ACTIVITY_STATUSES);
  @property({type: Boolean})
  lowResolutionLayout = false;

  private readonly routeDetailsUnsubscribe: Unsubscribe;
  private readonly partnersDataUnsubscribe: Unsubscribe;
  private readonly partnersPermissionsUnsubscribe: Unsubscribe;
  private readonly debouncedLoading: Callback;

  constructor() {
    super();
    // List loading request
    this.debouncedLoading = debounce((params: EtoolsRouteQueryParam) => {
      this.loadingInProcess = true;
      store
        .dispatch<AsyncEffect>(loadPartnersList(params, !this.count))
        .catch(() => fireEvent(this, 'toast', {text: getTranslation('ERROR_LOAD_ACTIVITIES_LIST')}))
        .then(() => (this.loadingInProcess = false));
    }, 400);

    // route params listener
    this.routeDetailsUnsubscribe = store.subscribe(
      routeDetailsSelector((details: EtoolsRouteDetails) => this.onRouteChange(details), false)
    );
    this.addEventListener('sort-changed', ((event: CustomEvent<SortDetails>) => this.changeSort(event.detail)) as any);
    const currentRoute = (store.getState() as IRootState).app.routeDetails;
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

    // set partnersList on store data changes
    this.partnersPermissionsUnsubscribe = store.subscribe(
      tpmPartnersPermissions((permissions: GenericObject | null) => {
        this.showAddButton = canAdd(permissions);
      }, false)
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
      css`
        .search-container {
          display: flex;
          min-height: 73px;
        }
        .search-input {
          width: 100%;
        }
        .search-filters {
          flex-grow: 1;
          margin-block: 5px;
        }
        .primary-btn {
          background-color: var(--green-color);
          font-weight: 500;
          color: white;
        }
        .with-prefix {
          padding-inline-start: 12px;
          padding-inline-end: 18px;
          margin-right: -25px;
          --etools-icon-font-size: var(--etools-font-size-20, 20px);
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
    this.partnersPermissionsUnsubscribe();
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
    const routeDetails: EtoolsRouteDetails | null = EtoolsRouter.getRouteDetails();
    const params: string =
      routeDetails && routeDetails.queryParams ? `?${EtoolsRouter.encodeQueryParams(routeDetails.queryParams)}` : '';
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

  private onRouteChange({routeName, subRouteName, queryParams}: EtoolsRouteDetails): void {
    if (!(routeName === 'partners' && subRouteName === 'partners-list')) {
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
}
