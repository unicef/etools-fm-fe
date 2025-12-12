import {CSSResult, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {template} from './sites.tpl';
import {store} from '../../../../redux/store';
import {Unsubscribe} from 'redux';
import {sitesSelector} from '../../../../redux/selectors/site-specific-locations.selectors';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {loadSiteLocations} from '../../../../redux/effects/site-specific-locations.effects';
import {updateQueryParams} from '../../../../routing/routes';
import {locationsInvert} from './locations-invert';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {openDialog} from '@unicef-polymer/etools-utils/dist/dialog.util';
import './sites-popup/sites-popup';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../styles/card-styles';
import {leafletStyles} from '../../../styles/leaflet-styles';
import {SitesTabStyles} from './sites.styles';
import {ListMixin} from '../../../common/mixins/list-mixin';
import {
  EtoolsRouteDetails,
  EtoolsRouteQueryParam,
  EtoolsRouteQueryParams
} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

@customElement('sites-tab')
export class SitesTabComponent extends ListMixin()<IGroupedSites>(LitElement) {
  @property() items: IGroupedSites[] = [];
  @property({type: Boolean})
  lowResolutionLayout = false;
  @property() listLoadingInProcess = false;
  private sitesObjects: Site[] | null = null;

  private readonly debouncedLoading: Callback;
  private sitesUnsubscribe!: Unsubscribe;
  private routeUnsubscribe!: Unsubscribe;

  constructor() {
    super();

    this.searchKeyDown = debounce(this.searchKeyDown.bind(this), 500) as any;
    this.debouncedLoading = debounce((params: EtoolsRouteQueryParam) => {
      this.listLoadingInProcess = true;
      store.dispatch<AsyncEffect>(loadSiteLocations(params)).then(() => (this.listLoadingInProcess = false));
    }, 100);
  }

  render(): TemplateResult | void {
    return template.apply(this);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.routeUnsubscribe = store.subscribe(
      routeDetailsSelector((details: EtoolsRouteDetails) => this.onRouteChange(details), false)
    );
    const currentRoute: EtoolsRouteDetails = (store.getState() as IRootState).app.routeDetails;
    this.onRouteChange(currentRoute);

    this.sitesUnsubscribe = store.subscribe(
      sitesSelector((sites: IListData<Site> | null) => {
        if (!sites) {
          return;
        }
        this.count = sites.count;
        this.sitesObjects = sites.results;
        this.items = locationsInvert(sites.results);
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.sitesUnsubscribe();
    this.routeUnsubscribe();
  }

  onRouteChange({routeName, subRouteName, queryParams}: EtoolsRouteDetails): void {
    if (routeName !== 'management' || subRouteName !== 'sites') {
      return;
    }

    const paramsAreValid: boolean = this.checkParams(queryParams, true);
    if (paramsAreValid) {
      this.queryParams = queryParams;
      this.debouncedLoading(this.queryParams);
    }
  }

  checkParams(params?: EtoolsRouteQueryParams | null, update?: boolean): boolean {
    const invalid: boolean = !params || !params.page || !params.page_size;
    if (invalid && update) {
      updateQueryParams({page: 1, page_size: 10, is_active: true});
    }
    return !invalid;
  }

  getActiveClass(isActive: boolean): string {
    return isActive ? 'active' : '';
  }

  getAdminLevel(level: number | null | string): string {
    return typeof level !== 'object' ? `Admin ${level}` : '';
  }

  openDialog(model?: Site): void {
    openDialog<SitesPopupData | undefined>({
      dialog: 'sites-popup',
      dialogData: {
        model,
        sitesObjects: this.sitesObjects as Site[]
      }
    }).then(({confirmed}: IDialogResponse<any>) => {
      if (!confirmed) {
        return;
      }
      if (!model) {
        // update params
        updateQueryParams({page: 1});
      }
      // refresh current list
      this.debouncedLoading();
    });
  }

  changeShowInactive(event: CustomEvent): void {
    // prevent updating during initialization
    const checked = (event.currentTarget as HTMLInputElement).checked;
    if (checked) {
      updateQueryParams({is_active: null, page: 1});
    } else {
      updateQueryParams({is_active: true, page: 1});
    }
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

  static get styles(): CSSResult[] {
    return [elevationStyles, SharedStyles, pageLayoutStyles, layoutStyles, CardStyles, SitesTabStyles, leafletStyles];
  }
}
