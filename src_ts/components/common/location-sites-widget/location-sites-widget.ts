import {CSSResultArray, LitElement, PropertyValues, TemplateResult} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {template} from './location-sites-widget.tpl';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {currentWorkspaceSelector} from '../../../redux/selectors/static-data.selectors';
import {IMarker, MapHelper} from '../map-mixin';
import {locationsInvert} from '../../pages/management/sites/locations-invert';
import {LocationWidgetStyles} from '../location-widget/location-widget.styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {SharedStyles} from '../../styles/shared-styles';
import {TemplatesStyles} from '../../pages/templates/templates/templates.styles';
import {CardStyles} from '../../styles/card-styles';
import {elevationStyles} from '@unicef-polymer/etools-modules-common/dist/styles/elevation-styles';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {leafletStyles} from '../../styles/leaflet-styles';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {loadSites} from '../../../redux/effects/site-specific-locations.effects';
import {EtoolsRouteQueryParam} from '@unicef-polymer/etools-utils/dist/interfaces/router.interfaces';

const DEFAULT_COORDINATES: L.LatLngTuple = [-0.09, 51.505];

@customElement('location-sites-widget')
export class LocationSitesWidgetComponent extends LitElement {
  @property() selectedLocation: string | null = null;
  @property() selectedSites: Site[] = [];
  @property() sitesList!: Site[];

  @property() hasSites = true;
  @property({type: String, reflect: true}) locationSearch = '';

  @property() private mapInitializationProcess = false;
  @query('#map') private mapElement!: HTMLElement;
  @query('#siteList') siteListEl!: HTMLElement;

  protected defaultMapCenter: L.LatLngTuple = DEFAULT_COORDINATES;
  private MapHelper!: MapHelper;
  private currentWorkspaceUnsubscribe!: Unsubscribe;
  private readonly debouncedLoadingSites: Callback;
  private loadingParams = {page: 1, page_size: 10, is_active: true, search: ''};
  private itemsCount: number = 0;
  private sitesLoading = true;

  static get styles(): CSSResultArray {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
      CardStyles,
      TemplatesStyles,
      LocationWidgetStyles,
      leafletStyles
    ];
  }
  get itemStyle(): string {
    // language=CSS
    return `
      .site-line,
      .location-line {
        position: relative;
        display: flex;
        padding: 5px;
        margin-bottom: 2px;
      }

      .site-line:last-child,
      .location-line:last-child {
        margin-bottom: 0;
      }

      .site-line:hover,
      .location-line:hover {
        background-color: var(--gray-06);
        cursor: pointer;
      }

      .site-line .gateway-name,
      .location-line .gateway-name {
        flex: none;
        width: 100px;
        color: var(--gray-light);
      }

      .site-line .location-name,
      .location-line .location-name {
        flex: auto;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-right: 5px;
      }

      .site-line .deselect-btn,
      .location-line .deselect-btn {
        flex: none;
        width: 50px;
        text-align: center;
        color: #dd0000;
      }

      .site-line .deselect-btn span,
      .location-line .deselect-btn span {
        display: none;
      }

      .site-line.selected,
      .location-line.selected .deselect-btn {
        background-color: #f3e5bf;
      }

      .site-line.selected .deselect-btn span,
      .location-line.selected .deselect-btn span {
        display: inline;
      }

      .locations-list div:not(.missing-sites) ~ .no-search-results,
      .locations-list div.missing-sites:not([hidden]) + .no-search-results {
        display: none;
      }`;
  }

  protected get loadingInProcess(): boolean {
    return this.mapInitializationProcess;
  }

  render(): TemplateResult {
    return template.call(this);
  }

  constructor() {
    super();

    this.search = debounce(this.search.bind(this), 500) as any;
    this.debouncedLoadingSites = debounce((params: EtoolsRouteQueryParam) => {
      this.sitesLoading = true;
      loadSites(params)
        .then((resp: IListData<Site>) => {
          this.itemsCount = resp.count;
          const sites = locationsInvert(resp.results)
            .map((location: IGroupedSites) => location.sites)
            .reduce((allSites: Site[], currentSites: Site[]) => [...allSites, ...currentSites], []);

          if (params.page === 1) {
            this.sitesList = sites;
          } else {
            this.sitesList = this.sitesList.concat(sites);
          }
          this.sitesLoading = false;
          this.hasSites = this.sitesList.length > 0;
          if (!this.mapInitializationProcess) {
            this.addSitesToMap();
          }

          if (this.selectedSites.length) {
            this.checkSelectedSites(this.selectedSites, this.selectedLocation);
          }
        })
        .finally(() => {
          this.sitesLoading = false;
        });
    }, 300);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.MapHelper = new MapHelper();
    this.mapInitializationProcess = true;

    this.currentWorkspaceUnsubscribe = store.subscribe(
      currentWorkspaceSelector((workspace: Workspace | undefined) => {
        if (!workspace) {
          return;
        }
        this.defaultMapCenter = (workspace.point && workspace.point.coordinates) || DEFAULT_COORDINATES;
        this.mapInitialisation();
      })
    );

    // this.sitesUnsubscribe = store.subscribe(
    //   sitesSelector((sites: Site[] | null) => {
    //     if (!sites) {
    //       return;
    //     }

    //     this.sites = locationsInvert(sites)
    //       .map((location: IGroupedSites) => location.sites)
    //       .reduce((allSites: Site[], currentSites: Site[]) => [...allSites, ...currentSites], []);

    //     this.sitesList = this.sites.filter((s: Site) => s.is_active);
    //     this.sitesLoading = false;
    //     this.hasSites = this.sitesList.length > 0;
    //     if (!this.mapInitializationProcess) {
    //       this.addSitesToMap();
    //     }

    //     if (this.selectedSites.length) {
    //       this.checkSelectedSites(this.selectedSites, this.selectedLocation);
    //     }
    //   })
    // );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.currentWorkspaceUnsubscribe();
  }

  addSitesToMap(): void {
    if (!this.MapHelper.map || !this.sitesList) {
      return;
    }
    this.MapHelper.removeCluster();
    const siteClick = this.onSiteClick.bind(this);
    const reversedMarks: MarkerDataObj[] = [];
    (this.sitesList || []).forEach((location) => {
      reversedMarks.push({
        coords: [location.point.coordinates[1], location.point.coordinates[0]],
        staticData: location,
        popup: location.name
      });
    });

    this.MapHelper.addCluster(reversedMarks, siteClick);
    this.requestUpdate();
    setTimeout(() => {
      this.showSelectedSite();
    }, 100);
  }

  showSelectedSite(): void {
    if (this.selectedSites && this.selectedSites.length && this.selectedLocation) {
      const site = this.selectedSites[0]; //, parent: {id: this.selectedLocation}} as Site;
      this.onSiteHoverStart(site);
      this.onSiteLineClick(site);
    }
  }

  onSiteHoverStart(location: Site): void {
    const site = (this.MapHelper.staticMarkers || []).find((marker: IMarker) => marker.staticData.id === location.id);
    if (site) {
      this.MapHelper.markerClusters.zoomToShowLayer(site, () => {
        setTimeout(() => {
          site.openPopup();
        }, 10);
      });
    }
  }

  onSiteLineClick(site: Site): void {
    this.changeLocationAndSite(site.parent.id, {id: site.id, name: site.name});
  }

  onSiteClick(e: CustomEvent): void {
    const site = e.target as any;
    this.changeLocationAndSite(site.staticData.parent.id, {id: site.staticData.id, name: site.staticData.name});
  }

  onRemoveSiteClick(event: CustomEvent): void {
    event.preventDefault();
    this.changeLocationAndSite();
  }

  changeLocationAndSite(idLocation?: string, site?: any): void {
    fireEvent(this, 'location-changed', {location: idLocation});
    fireEvent(this, 'sites-changed', {sites: site ? [site] : null});
  }

  getSiteLineClass(siteId: number | string): string {
    const isSelected: boolean = (this.selectedSites || []).some((site: any) => site.id == siteId);
    return isSelected ? 'selected' : '';
  }

  onSiteListScroll(): void {
    if (this.siteListEl.scrollTop + this.siteListEl.clientHeight >= this.siteListEl.scrollHeight) {
      if (this.itemsCount > (this.sitesList || []).length) {
        this.loadingParams.page++;
        this.debouncedLoadingSites(this.loadingParams);
      }
    }
  }

  search({value}: {value: string} = {value: ''}): void {
    if (this.locationSearch !== value) {
      this.locationSearch = value;
      if (this.locationSearch) {
        this.loadingParams = {page: 1, page_size: 10, is_active: true, search: this.locationSearch};
      } else {
        this.loadingParams = {page: 1, page_size: 10, is_active: true, search: ''};
      }
      this.debouncedLoadingSites(this.loadingParams);
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.mapInitialisation();
    this.debouncedLoadingSites(this.loadingParams);
  }

  protected updated(changedProperties: PropertyValues): void {
    const oldSelectedSites: number[] | undefined = changedProperties.get('selectedSites') as number[] | undefined;
    if (oldSelectedSites || changedProperties.has('mapInitializationProcess')) {
      this.checkSelectedSites(this.selectedSites, this.selectedLocation);
    }
  }

  private checkSelectedSites(selectedSites: any[], selectedLocation: string | null): void {
    if (this.mapInitializationProcess) {
      return;
    }
    if (selectedSites.length && !selectedLocation) {
      this.selectedSites = [];
      return;
    }

    if (this.sitesLoading || !selectedSites.length) {
      return;
    }
    const existingIDs = new Set((this.sitesList || []).map((item) => item.id));
    let missingSites = selectedSites.filter((selected: any) => !existingIDs.has(selected.id));
    missingSites = missingSites.map((site: any) => site.id);

    if (missingSites.length !== 0) {
      console.warn(`This sites are missing in list: ${missingSites}. They will be removed from selected`);
      this.selectedSites = selectedSites.filter((selected: any) => !missingSites.includes(selected.id));
      missingSites.forEach((siteId: number) => this.MapHelper.removeStaticMarker(siteId));
    }
  }

  private mapInitialisation(): void {
    if (!this.mapElement) {
      return;
    }
    if (this.mapInitializationProcess) {
      this.MapHelper.initMap(this.mapElement);
    }
    this.MapHelper.waitForMapToLoad().then(() => {
      this.addSitesToMap();
      this.setInitialMapView();
      this.mapInitializationProcess = false;
    });
  }

  private setInitialMapView(): void {
    const reversedCoords: L.LatLngTuple = [...this.defaultMapCenter].reverse() as L.LatLngTuple;
    const zoom = 6;
    this.MapHelper.map!.setView(reversedCoords, zoom);
  }
}
