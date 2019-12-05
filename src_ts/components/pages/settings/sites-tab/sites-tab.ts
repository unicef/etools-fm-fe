import {CSSResult, customElement, LitElement, property, TemplateResult} from 'lit-element';
import {template} from './sites-tab.tpl';
import {store} from '../../../../redux/store';
import {Unsubscribe} from 'redux';
import {sitesSelector} from '../../../../redux/selectors/site-specific-locations.selectors';
import {routeDetailsSelector} from '../../../../redux/selectors/app.selectors';
import {loadSiteLocations} from '../../../../redux/effects/site-specific-locations.effects';
import {updateQueryParams} from '../../../../routing/routes';
import {locationsInvert} from './locations-invert';
import {elevationStyles} from '../../../styles/elevation-styles';
import {debounce} from '../../../utils/debouncer';
import {openDialog} from '../../../utils/dialog';
import './sites-popup/sites-popup';
import {SharedStyles} from '../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../styles/flex-layout-classes';
import {CardStyles} from '../../../styles/card-styles';
import {leafletStyles} from '../../../styles/leaflet-styles';
import {SitesTabStyles} from './sites-tab.styles';
import {ListMixin} from '../../../common/mixins/list-mixin';

@customElement('sites-tab')
export class SitesTabComponent extends ListMixin()<IGroupedSites>(LitElement) {
  @property() items: IGroupedSites[] = [];

  @property() listLoadingInProcess: boolean = false;
  private sitesObjects: Site[] | null = null;

  private readonly debouncedLoading: Callback;
  private sitesUnsubscribe!: Unsubscribe;
  private routeUnsubscribe!: Unsubscribe;

  constructor() {
    super();
    this.debouncedLoading = debounce(() => {
      this.listLoadingInProcess = true;
      store.dispatch<AsyncEffect>(loadSiteLocations()).then(() => (this.listLoadingInProcess = false));
    }, 100);
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      FlexLayoutClasses,
      CardStyles,
      SitesTabStyles,
      leafletStyles
    ];
  }

  render(): TemplateResult | void {
    return template.apply(this);
  }

  connectedCallback(): void {
    super.connectedCallback();

    this.routeUnsubscribe = store.subscribe(
      routeDetailsSelector((details: IRouteDetails) => this.onRouteChange(details), false)
    );
    const currentRoute: IRouteDetails = (store.getState() as IRootState).app.routeDetails;
    this.onRouteChange(currentRoute);

    this.sitesUnsubscribe = store.subscribe(
      sitesSelector((sites: Site[] | null) => {
        if (!sites) {
          return;
        }
        this.sitesObjects = sites;
        const paramsAreValid: boolean = this.checkParams(this.queryParams);
        if (paramsAreValid) {
          this.refreshData();
        }
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.sitesUnsubscribe();
    this.routeUnsubscribe();
  }

  onRouteChange({routeName, subRouteName, queryParams}: IRouteDetails): void {
    if (routeName !== 'settings' || subRouteName !== 'sites') {
      return;
    }

    const paramsAreValid: boolean = this.checkParams(queryParams, true);
    if (paramsAreValid) {
      this.queryParams = queryParams;
    } else {
      return;
    }

    if (!this.sitesObjects) {
      this.debouncedLoading();
    } else {
      this.refreshData();
    }
  }

  checkParams(params?: IRouteQueryParams | null, update?: boolean): boolean {
    const invalid: boolean = !params || !params.page || !params.page_size;
    if (invalid && update) {
      updateQueryParams({page: 1, page_size: 10});
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

  changeShowInactive({detail}: CustomEvent): void {
    // prevent updating during initialization
    const checked: boolean = detail.value;
    if (!this.sitesObjects || checked === null || checked === undefined) {
      return;
    }
    if (checked) {
      updateQueryParams({show_inactive: checked, page: 1});
    } else {
      updateQueryParams({show_inactive: null, page: 1});
    }
    this.refreshData();
  }

  searchKeyDown({detail}: CustomEvent): void {
    // prevent updating during initialization
    if (!this.sitesObjects) {
      return;
    }
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
    if (value.length !== 1) {
      this.refreshData();
    }
  }

  private filterSearch(sitesObject: Site[]): Site[] {
    if (!this.queryParams) {
      return sitesObject;
    }
    if (this.queryParams.search) {
      const match: string = this.queryParams.search.toLowerCase();
      return sitesObject.filter((site: Site) => {
        const siteName: string = site.parent.name.toLowerCase();
        const parentName: string = site.name.toLowerCase();
        return !!~siteName.indexOf(match) || !!~parentName.indexOf(match);
      });
    }
    return sitesObject;
  }

  private refreshData(): void {
    let sitesObject: Site[] = this.filterSites(this.sitesObjects || []);
    this.count = sitesObject.length;
    sitesObject = this.filterPagination(sitesObject);
    this.items = locationsInvert(sitesObject);
  }

  private filterSites(sitesObject: Site[]): Site[] {
    const sites: Site[] = this.filterShowInactive(sitesObject);
    return this.filterSearch(sites);
  }

  private filterShowInactive(sitesObject: Site[]): Site[] {
    if (!this.queryParams) {
      return sitesObject;
    }
    if (!this.queryParams.show_inactive) {
      return sitesObject.filter((site: Site) => site.is_active);
    }
    return sitesObject;
  }

  private filterPagination(sitesObject: Site[]): Site[] {
    if (!this.queryParams) {
      return sitesObject;
    }
    const page: number = +this.queryParams.page;
    const pageSize: number = +this.queryParams.page_size;
    if (!page || !pageSize) {
      return sitesObject;
    }
    const startIndex: number = page * pageSize - pageSize;
    const endIndex: number = page * pageSize;
    return sitesObject.slice(startIndex, endIndex);
  }
}
