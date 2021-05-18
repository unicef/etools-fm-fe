import {CSSResultArray, customElement, LitElement, property, PropertyValues, query, TemplateResult} from 'lit-element';
import {template} from './location-sites-widget.tpl';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {currentWorkspaceSelector} from '../../../redux/selectors/static-data.selectors';
import {LatLngTuple} from 'leaflet';
import {IMarker, MapHelper} from '../map-mixin';
import {sitesSelector} from '../../../redux/selectors/site-specific-locations.selectors';
import {locationsInvert} from '../../pages/plan/sites-tab/locations-invert';
import {LocationWidgetStyles} from '../location-widget/location-widget.styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../styles/flex-layout-classes';
import {SharedStyles} from '../../styles/shared-styles';
import {TemplatesStyles} from '../../pages/templates/templates-tab/templates-tab.styles';
import {CardStyles} from '../../styles/card-styles';
import {elevationStyles} from '../../styles/elevation-styles';
import {fireEvent} from '../../utils/fire-custom-event';
import {leafletStyles} from '../../styles/leaflet-styles';

const DEFAULT_COORDINATES: LatLngTuple = [-0.09, 51.505];

@customElement('location-sites-widget')
export class LocationSitesWidgetComponent extends LitElement {
  @property() selectedLocation: string | null = null;
  @property() selectedSites: number[] = [];

  @property() sites: Site[] = [];
  @property() sitesList!: Site[];

  @property() hasSites = true;
  @property({type: String, reflect: true}) locationSearch = '';

  @property() private mapInitializationProcess = false;
  @query('#map') private mapElement!: HTMLElement;

  protected defaultMapCenter: LatLngTuple = DEFAULT_COORDINATES;
  private MapHelper!: MapHelper;
  private currentWorkspaceUnsubscribe!: Unsubscribe;
  private sitesUnsubscribe!: Unsubscribe;
  private sitesLoading = true;

  static get styles(): CSSResultArray {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      FlexLayoutClasses,
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

    this.sitesUnsubscribe = store.subscribe(
      sitesSelector((sites: Site[] | null) => {
        if (!sites) {
          return;
        }

        this.sites = locationsInvert(sites)
          .map((location: IGroupedSites) => location.sites)
          .reduce((allSites: Site[], currentSites: Site[]) => [...allSites, ...currentSites], []);

        this.sitesList = this.sites.filter((s: Site) => s.is_active);
        this.sitesLoading = false;
        this.hasSites = this.sitesList.length > 0;
        if (!this.mapInitializationProcess) {
          this.addSitesToMap();
        }

        if (this.selectedSites.length) {
          this.checkSelectedSites(this.selectedSites, this.selectedLocation);
        }
      })
    );
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.currentWorkspaceUnsubscribe();
    this.sitesUnsubscribe();
  }

  addSitesToMap(): void {
    if (!this.MapHelper.map || !this.sitesList || this.MapHelper.markerClusters) {
      return;
    }

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
      const site = {id: this.selectedSites[0], parent: {id: this.selectedLocation}} as Site;
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
    this.changeLocationAndSite(site.parent.id, site.id);
  }

  onSiteClick(e: CustomEvent): void {
    const site = e.target as any;
    this.changeLocationAndSite(site.staticData.parent.id, site.staticData.id);
  }

  onRemoveSiteClick(event: CustomEvent): void {
    event.preventDefault();
    this.changeLocationAndSite();
  }

  changeLocationAndSite(idLocation?: string, idSite?: number): void {
    fireEvent(this, 'location-changed', {location: idLocation});
    fireEvent(this, 'sites-changed', {sites: [idSite]});
  }

  getSiteLineClass(siteId: number | string): string {
    const isSelected: boolean = this.selectedSites.findIndex((id: number) => id === siteId) !== -1;
    return isSelected ? 'selected' : '';
  }

  search({value}: {value: string} = {value: ''}): void {
    if (this.locationSearch !== value) {
      this.locationSearch = value;
      if (this.locationSearch) {
        this.sitesList = this.sites.filter((site: Site) => {
          return site.name.toLowerCase().includes(value.toLowerCase());
        });
      } else {
        this.sitesList = [...this.sites];
      }
    }
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.mapInitialisation();
  }

  protected updated(changedProperties: PropertyValues): void {
    const oldSelectedSites: number[] | undefined = changedProperties.get('selectedSites') as number[] | undefined;
    if (oldSelectedSites || changedProperties.has('mapInitializationProcess')) {
      this.checkSelectedSites(this.selectedSites, this.selectedLocation);
    }
  }

  private checkSelectedSites(selectedSites: number[], selectedLocation: string | null): void {
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

    const missingSites: number[] = selectedSites.filter(
      (siteId: number) => this.sites.findIndex((site: Site) => site.id === siteId) === -1
    );

    if (missingSites.length !== 0) {
      console.warn(`This sites are missing in list: ${missingSites}. They will be removed from selected`);
      this.selectedSites = selectedSites.filter((siteId: number) => !missingSites.includes(siteId));
      missingSites.forEach((siteId: number) => this.MapHelper.removeStaticMarker(siteId));
    }
  }

  private mapInitialisation(): void {
    if (!this.mapElement) {
      return;
    }
    if (this.mapInitializationProcess) {
      this.mapInitializationProcess = false;
      this.MapHelper.initMap(this.mapElement);
      this.addSitesToMap();
    }
    this.setInitialMapView();
  }

  private setInitialMapView(): void {
    const reversedCoords: LatLngTuple = [...this.defaultMapCenter].reverse() as LatLngTuple;
    const zoom = 6;
    this.MapHelper.map!.setView(reversedCoords, zoom);
  }
}
