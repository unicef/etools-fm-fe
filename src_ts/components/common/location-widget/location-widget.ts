import {CSSResultArray, customElement, LitElement, property, PropertyValues, query, TemplateResult} from 'lit-element';
import {template} from './location-widget.tpl';
import {store} from '../../../redux/store';
import {Unsubscribe} from 'redux';
import {currentWorkspaceSelector} from '../../../redux/selectors/static-data.selectors';
import {FitBoundsOptions, LatLngTuple, Polygon, PolylineOptions} from 'leaflet';
import {MapHelper} from '../map-mixin';
import {sitesSelector} from '../../../redux/selectors/site-specific-locations.selectors';
import {locationsInvert} from '../../pages/management/sites-tab/locations-invert';
import {LocationWidgetStyles} from './location-widget.styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../styles/flex-layout-classes';
import {SharedStyles} from '../../styles/shared-styles';
import {TemplatesStyles} from '../../pages/templates/templates-tab/templates-tab.styles';
import {CardStyles} from '../../styles/card-styles';
import {elevationStyles} from '../../styles/elevation-styles';
import {
  widgetLocationPathLoading,
  widgetLocationsLoading,
  widgetLocationsItems
} from '../../../redux/selectors/widget-locations.selectors';
import {loadLocationPath, loadLocationsChunk} from '../../../redux/effects/widget-locations.effects';
import {fireEvent} from '../../utils/fire-custom-event';
import {getLocationPart} from '../../utils/get-location-part';
import {reverseNestedArray} from '../../utils/map-helper';
import {widgetLocations} from '../../../redux/reducers/widget-locations.reducer';
import {specificLocations} from '../../../redux/reducers/site-specific-locations.reducer';
import {leafletStyles} from '../../styles/leaflet-styles';
import {equals} from 'ramda';
import clone from 'ramda/es/clone';
import {debounce} from '../../utils/debouncer';
import {translate} from 'lit-translate';

store.addReducers({widgetLocations, specificLocations});

const DEFAULT_COORDINATES: LatLngTuple = [-0.09, 51.505];
const POLYGON_OPTIONS: PolylineOptions = {color: '#eddaa3', stroke: false, fillOpacity: 0.4, pane: 'tilePane'};

@customElement('location-widget')
export class LocationWidgetComponent extends LitElement {
  @property() selectedLocation: string | null = null;
  @property() selectedSites: number[] = [];
  @property({type: Boolean, attribute: 'multiple-sites'}) multipleSites = false;

  // lazy load list
  @property() items: (WidgetLocation | Site)[] = [];
  @property() sites: Site[] = [];
  @property() sitesLocation: Site[] = [];
  @property() isSiteList = false;

  @property({type: String, reflect: true}) locationSearch = '';
  @property() protected history: WidgetLocation[] = [];
  @property() private listLoading = false;
  @property() private pathLoading = false;
  @property() private mapInitializationProcess = false;
  @query('#map') private mapElement!: HTMLElement;
  protected defaultMapCenter: LatLngTuple = DEFAULT_COORDINATES;
  private polygon: Polygon | null = null;
  private MapHelper!: MapHelper;
  private currentWorkspaceUnsubscribe!: Unsubscribe;
  private widgetLoadingUnsubscribe!: Unsubscribe;
  private pathLoadingUnsubscribe!: Unsubscribe;
  private sitesUnsubscribe!: Unsubscribe;
  private widgetItemsUnsubscribe!: Unsubscribe;
  private sitesLoading = true;
  private inputDebounce!: Callback;

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
    return this.listLoading || this.pathLoading || this.mapInitializationProcess;
  }

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.MapHelper = new MapHelper();
    this.mapInitializationProcess = true;

    this.inputDebounce = debounce((value: string) => {
      const state: IRootState = store.getState();
      const {query} = state.widgetLocations;
      if (value) {
        store.dispatch<AsyncEffect>(loadLocationsChunk({search: value, query, page: 1, reload: true}));
      } else {
        store.dispatch<AsyncEffect>(loadLocationsChunk({search: '', query, page: 1, reload: true}));
      }
    }, 300);

    store
      .dispatch<AsyncEffect>(loadLocationsChunk({query: 'level=0', page: 1, reload: true}))
      .catch(() => fireEvent(this, 'toast', {text: translate('ERROR_LOAD_LOCATIONS')}));

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

        this.sitesLoading = false;
        if (this.selectedSites.length) {
          this.checkSelectedSites(this.selectedSites, this.selectedLocation);
        }
      })
    );

    this.widgetLoadingUnsubscribe = store.subscribe(
      widgetLocationsLoading((loading: boolean | null) => {
        if (typeof loading !== 'boolean') {
          return;
        }
        this.listLoading = loading;
      }, false)
    );

    this.widgetItemsUnsubscribe = store.subscribe(
      widgetLocationsItems((items: WidgetLocation[]) => {
        this.items = items;
      })
    );

    this.pathLoadingUnsubscribe = store.subscribe(
      widgetLocationPathLoading((pathLoading: boolean | null) => {
        if (typeof pathLoading !== 'boolean') {
          return;
        }
        this.pathLoading = pathLoading;
        if (!pathLoading && this.selectedLocation && !this.loadingInProcess) {
          this.restoreHistory(this.selectedLocation);
        }
      }, false)
    );
  }

  loadNextItems(): void {
    const state: IRootState = store.getState();
    const {hasNext, page} = state.widgetLocations;
    if (hasNext) {
      store.dispatch<AsyncEffect>(loadLocationsChunk({page: page + 1}));
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.currentWorkspaceUnsubscribe();
    this.widgetLoadingUnsubscribe();
    this.pathLoadingUnsubscribe();
    this.sitesUnsubscribe();
    this.widgetItemsUnsubscribe();
  }

  onLocationLineClick(location: WidgetLocation): void {
    this.history = [...this.history, location];
    this.selectLocation(location);
    this.locationSearch = '';
  }

  onSiteLineClick(location: Site): void {
    const index: number = this.selectedSites.findIndex((id: number) => id === location.id);

    if (index === -1 && !this.multipleSites) {
      this.MapHelper.removeStaticMarkers();
      this.selectedSites.splice(0);
    }

    if (index === -1) {
      this.selectedSites = [...this.selectedSites, location.id];
      const coords: CoordinatesArray = [...location.point.coordinates].reverse() as CoordinatesArray;
      this.MapHelper.addStaticMarker({coords, staticData: location, popup: location.name});
    } else {
      const newSelected: number[] = [...this.selectedSites];
      newSelected.splice(index, 1);
      this.selectedSites = [...newSelected];
      this.MapHelper.removeStaticMarker(location.id);
    }
  }

  onSiteHoverStart(location: Site): void {
    const alreadySelected: boolean = this.getSiteLineClass(location.id) === 'selected';
    if (alreadySelected) {
      return;
    }
    const coords: CoordinatesArray = [...location.point.coordinates].reverse() as CoordinatesArray;
    this.MapHelper.addDynamicMarker(coords);
  }

  onSiteHoverEnd(): void {
    this.MapHelper.removeDynamicMarker();
  }

  getSiteLineClass(siteId: number | string): string {
    const isSelected: boolean = this.selectedSites.findIndex((id: number) => id === siteId) !== -1;
    return isSelected ? 'selected' : '';
  }

  removeFromHistory(index: number): void {
    this.history.splice(index);
    this.history = [...this.history];

    this.MapHelper.removeStaticMarkers();
    this.selectedSites = [];
    this.selectedLocation = null;
    this.locationSearch = '';

    const currentLocation: WidgetLocation | undefined = this.history[index - 1];
    if (!currentLocation) {
      // return to initial map state
      this.resetMapAndHistory();
    } else {
      this.selectLocation(currentLocation);
    }
  }

  // method to restore history if selectedLocation come outside component
  restoreHistory(locationId: string | null, loading?: boolean): void {
    if (!locationId || loading) {
      return;
    }

    const lastLocation: WidgetLocation | null = this.getLastLocation();
    if (lastLocation && lastLocation.id === locationId) {
      return;
    }

    const state: IRootState = store.getState();
    const history: WidgetLocation[] = state.widgetLocations.pathCollection[locationId];
    if (!history) {
      store.dispatch<AsyncEffect>(loadLocationPath(locationId));
      return;
    } else if (history.length === 0) {
      return;
    }

    const currentLocation: WidgetLocation | null = this.getLastLocation(history);
    if (currentLocation && !currentLocation.is_leaf) {
      console.warn('Selected Location must be low level!');
      this.selectedLocation = null;
      this.resetMapAndHistory();
      return;
    }

    this.history = [...history];
    this.selectLocation(currentLocation as WidgetLocation);
  }

  search({value}: {value: string} = {value: ''}): void {
    if (this.locationSearch !== value) {
      this.locationSearch = value;
      if (!this.isSiteList) {
        this.inputDebounce(value);
      } else {
        this.sitesLocation = this.sites.filter((site: Site) => {
          return site.parent.id === this.selectedLocation && site.name.toLowerCase().includes(value.toLowerCase());
        });
      }
    }
  }

  getHistoryInputLabel(adminLevel: number, adminLelevelName: string): string {
    const levelString = !adminLevel && adminLevel !== 0 ? '' : `Admin ${adminLevel} - `;
    return !adminLevel && !adminLelevelName ? '' : `${levelString}${adminLelevelName}`;
  }

  getLocationPart(location = '', partToSelect: string): string {
    return getLocationPart(location, partToSelect);
  }

  isSitesEmpty(): boolean {
    const lastLocation: WidgetLocation | null = this.getLastLocation();
    const isSitesList: boolean = lastLocation !== null && lastLocation.is_leaf;
    const isEmptyList = !this.sitesLocation.length;
    return (this.loadingInProcess || isEmptyList) && isSitesList && !this.locationSearch;
  }

  isSearchEmpty(): boolean {
    const lastLocation: WidgetLocation | null = this.getLastLocation();
    const isSitesList: boolean = lastLocation !== null && lastLocation.is_leaf;
    const isEmptyList: boolean = isSitesList ? !this.sitesLocation.length : !this.items.length;
    return (this.loadingInProcess || isEmptyList) && !!this.locationSearch;
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

    const properties: string[] = ['selectedLocation', 'listLoading', 'pathLoading', 'mapInitializationProcess'];
    const locationOrLoadingChanged: boolean = properties.some((propertyName: string) =>
      changedProperties.has(propertyName)
    );
    if (locationOrLoadingChanged) {
      this.restoreHistory(this.selectedLocation, this.loadingInProcess);
    }

    if (oldSelectedSites && !equals(oldSelectedSites, this.selectedSites)) {
      fireEvent(this, 'sites-changed', {sites: this.selectedSites});
    }

    if (changedProperties.has('selectedLocation')) {
      fireEvent(this, 'location-changed', {location: this.selectedLocation});
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

    this.selectedSites.forEach((siteId: number) => {
      const exists: boolean = this.MapHelper.markerExists(siteId);
      if (exists) {
        return;
      }

      const missingSite: Site = this.sites.find((site: Site) => site.id === siteId) as Site;
      const coords: CoordinatesArray = [...missingSite.point.coordinates].reverse() as CoordinatesArray;
      this.MapHelper.addStaticMarker({coords, staticData: missingSite, popup: missingSite.name});
    });
    this.MapHelper.reCheckMarkers(this.selectedSites);
  }

  private getLastLocation(history?: WidgetLocation[]): WidgetLocation | null {
    const historyArray: WidgetLocation[] = history || this.history;
    const lastLocationIndex: number = historyArray.length - 1;
    return historyArray[lastLocationIndex] || null;
  }

  private selectLocation(location: WidgetLocation): void {
    this.centerAndDrawBorders(location);

    const {is_leaf: isLeaf, id} = location;
    this.isSiteList = isLeaf;
    if (!isLeaf) {
      store.dispatch<AsyncEffect>(loadLocationsChunk({query: `parent=${id}`, search: '', page: 1, reload: true}));
      this.selectedLocation = null;
    } else {
      this.selectedLocation = id;
      this.sitesLocation = this.sites.filter((site: Site) => site.parent.id === id && site.is_active);
    }
  }

  private centerAndDrawBorders(location: WidgetLocation): void {
    this.clearMap();

    const polygonCoordinates: CoordinatesArray[] = (location.geom.coordinates || []).flat();
    const pointCoordinates: CoordinatesArray = location.point.coordinates;
    const polygonIsEmpty = !polygonCoordinates.length;

    if (!polygonIsEmpty || pointCoordinates) {
      const coordinates: CoordinatesArray[] = polygonIsEmpty ? [pointCoordinates] : polygonCoordinates;
      const reversedCoordinates: any[] = reverseNestedArray(clone(coordinates));

      const options: FitBoundsOptions = polygonIsEmpty ? {maxZoom: this.MapHelper.map!.getZoom()} : {};
      this.MapHelper.map!.flyToBounds(reversedCoordinates, options);

      if (!polygonIsEmpty) {
        this.polygon = L.polygon(reversedCoordinates, POLYGON_OPTIONS);
        this.polygon.addTo(this.MapHelper.map!);
      }
    }
  }

  private clearMap(): void {
    if (this.polygon) {
      this.polygon.removeFrom(this.MapHelper.map!);
      this.polygon = null;
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
      this.setInitialMapView();
      this.mapInitializationProcess = false;
    });
  }

  private setInitialMapView(): void {
    const reversedCoords: LatLngTuple = [...this.defaultMapCenter].reverse() as LatLngTuple;
    const zoom = 6;
    this.MapHelper.map!.setView(reversedCoords, zoom);
  }

  private resetMapAndHistory(): void {
    // return to initial map state
    this.clearMap();
    this.setInitialMapView();
    store.dispatch<AsyncEffect>(loadLocationsChunk({query: 'level=0', search: '', page: 1, reload: true}));
    this.isSiteList = false;
    this.MapHelper.removeStaticMarkers();
    this.history = [];
  }
}
