import {CSSResultArray, customElement, LitElement, property, PropertyValues, query, TemplateResult} from 'lit-element';
import {template} from './location-widget.tpl';
import {store} from '../../../redux/store';
import {loadSiteLocations} from '../../../redux/effects/site-specific-locations.effects';
import {Unsubscribe} from 'redux';
import {currentWorkspaceSelector} from '../../../redux/selectors/static-data.selectors';
import {FitBoundsOptions, LatLngTuple, Polygon, PolylineOptions} from 'leaflet';
import {MapHelper} from '../map-mixin';
import {sitesSelector} from '../../../redux/selectors/site-specific-locations.selectors';
import {locationsInvert} from '../../pages/settings/sites-tab/locations-invert';
import {LocationWidgetStyles} from './location-widget.styles';
import {pageLayoutStyles} from '../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../styles/flex-layout-classes';
import {SharedStyles} from '../../styles/shared-styles';
import {TemplatesStyles} from '../../pages/plan/templates-tab/templates-tab.styles';
import {CardStyles} from '../../styles/card-styles';
import {elevationStyles} from '../../styles/elevation-styles';
import {
  widgetLocationPathLoading,
  widgetLocationsData,
  widgetLocationsLoading
} from '../../../redux/selectors/widget-locations.selectors';
import {loadLocationPath, loadWidgetLocations} from '../../../redux/effects/widget-locations.effects';
import {fireEvent} from '../../utils/fire-custom-event';
import {getLocationPart} from '../../utils/get-location-part';
import {widgetLocations} from '../../../redux/reducers/widget-locations.reducer';
import {specificLocations} from '../../../redux/reducers/site-specific-locations.reducer';
import {leafletStyles} from '../../styles/leaflet-styles';
import {equals} from 'ramda';

store.addReducers({widgetLocations, specificLocations});

const DEFAULT_COORDINATES: LatLngTuple = [-0.09, 51.505];
const POLYGON_OPTIONS: PolylineOptions = {color: '#eddaa3', stroke: false, fillOpacity: 0.8, pane: 'tilePane'};

@customElement('location-widget')
export class LocationWidgetComponent extends LitElement {
  @property() selectedLocation: string | null = null;
  @property() selectedSites: number[] = [];
  @property({type: Boolean, attribute: 'multiple-sites'}) multipleSites: boolean = false;

  protected currentList: string = 'level=0';
  protected widgetLocations: GenericObject<(Site | WidgetLocation)[]> = {};
  protected defaultMapCenter: LatLngTuple = DEFAULT_COORDINATES;
  @property() protected history: WidgetLocation[] = [];
  @property() protected locationSearch: string = '';
  @property() private listLoading: boolean = false;
  @property() private pathLoading: boolean = false;
  @property() private mapInitializationProcess: boolean = false;
  @query('#map') private mapElement!: HTMLElement;
  private polygon: Polygon | null = null;
  private MapHelper!: MapHelper;
  private currentWorkspaceUnsubscribe!: Unsubscribe;
  private widgetLocationsUnsubscribe!: Unsubscribe;
  private widgetLoadingUnsubscribe!: Unsubscribe;
  private pathLoadingUnsubscribe!: Unsubscribe;
  private sitesUnsubscribe!: Unsubscribe;
  private sitesLoading: boolean = true;

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

    const state: IRootState = store.getState();
    if (!state.specificLocations.data) {
      store.dispatch<AsyncEffect>(loadSiteLocations());
    }

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
        const convertedSites: GenericObject<Site[]> = locationsInvert(sites)
          .map((location: IGroupedSites) => [`sites_for_${location.id}`, location.sites] as [string, Site[]])
          .reduce((reducedLocations: {[key: string]: Site[]}, pair: [string, Site[]]) => {
            const [key, groupedSites] = pair;
            return {...reducedLocations, [key]: groupedSites};
          }, {});

        this.widgetLocations = Object.assign({}, this.widgetLocations, convertedSites);
        this.sitesLoading = false;
        if (this.selectedSites.length) {
          this.checkSelectedSites(this.selectedSites, this.selectedLocation);
        }
      })
    );

    this.widgetLocationsUnsubscribe = store.subscribe(
      widgetLocationsData((widgetStoreData: WidgetStoreData) => {
        if (!widgetStoreData) {
          return;
        }
        this.widgetLocations = {...this.widgetLocations, ...widgetStoreData};

        if (!widgetStoreData['level=0']) {
          store
            .dispatch<AsyncEffect>(loadWidgetLocations('level=0'))
            .catch(() => fireEvent(this, 'toast', {text: 'Can not Load Locations for Widget'}));
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

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.currentWorkspaceUnsubscribe();
    this.widgetLoadingUnsubscribe();
    this.pathLoadingUnsubscribe();
    this.widgetLocationsUnsubscribe();
    this.sitesUnsubscribe();
  }

  getListItems(path: string, loading?: boolean): (Site | WidgetLocation)[] {
    return (!loading && path && this.widgetLocations[path]) || [];
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

  locationsFilter(location: Site | WidgetLocation): boolean {
    return !this.locationSearch || location.name.toLocaleLowerCase().includes(this.locationSearch.toLocaleLowerCase());
  }

  getHistoryInputLabel(gateway: LocationGateway): string {
    const {admin_level: level, name}: LocationGateway = gateway || {};
    const levelString: string = !level && level !== 0 ? '' : `Admin ${level} - `;
    return !level && !name ? '' : `${levelString}${name}`;
  }

  getLocationPart(location: string = '', partToSelect: string): string {
    return getLocationPart(location, partToSelect);
  }

  hideEmptySitesMessage(path: string, loading: boolean): boolean {
    const lastLocation: WidgetLocation | null = this.getLastLocation();
    const isLeaf: boolean = lastLocation !== null && lastLocation.is_leaf;
    const isListEmpty: boolean = this.getListItems(path).length === 0;

    return loading || !isLeaf || !isListEmpty;
  }

  async updateMap(): Promise<void> {
    await Promise.resolve();
    this.MapHelper.invalidateSize();

    const location: WidgetLocation | null = this.getLastLocation();
    if (location) {
      this.centerAndDrawBorders(location);
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

    const sitesList: Site[] = (this.widgetLocations[`sites_for_${selectedLocation}`] || []) as Site[];
    const missingSites: number[] = selectedSites.filter(
      (siteId: number) => sitesList.findIndex((site: Site) => site.id === siteId) === -1
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

      const missingSite: Site = sitesList.find((site: Site) => site.id === siteId) as Site;
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
    const parent: string = isLeaf ? `sites_for_${id}` : `parent=${id}`;

    this.selectedLocation = isLeaf ? location.id : null;
    this.selectPath(parent, isLeaf);
  }

  private centerAndDrawBorders(location: WidgetLocation): void {
    this.clearMap();

    const polygonCoordinates: CoordinatesArray[] = (location.geom.coordinates || []).flat().flat();
    const pointCoordinates: CoordinatesArray = location.point.coordinates;
    const polygonIsEmpty: boolean = !polygonCoordinates.length;

    const coordinates: CoordinatesArray[] = polygonIsEmpty ? [pointCoordinates] : polygonCoordinates;
    const reversedCoordinates: CoordinatesArray[] = coordinates.map(
      (coordinate: CoordinatesArray) => [...coordinate].reverse() as CoordinatesArray
    );
    const options: FitBoundsOptions = polygonIsEmpty ? {maxZoom: this.MapHelper.map!.getZoom()} : {};
    this.MapHelper.map!.flyToBounds(reversedCoordinates, options);

    if (!polygonIsEmpty) {
      this.polygon = L.polygon(reversedCoordinates, POLYGON_OPTIONS);
      this.polygon.addTo(this.MapHelper.map!);
    }
  }

  private clearMap(): void {
    if (this.polygon) {
      this.polygon.removeFrom(this.MapHelper.map!);
      this.polygon = null;
    }
  }

  private selectPath(path: string, isLeaf?: boolean): void {
    if (!isLeaf && !this.widgetLocations[path]) {
      store.dispatch<AsyncEffect>(loadWidgetLocations(path));
    }

    this.currentList = path;
  }

  private mapInitialisation(): void {
    if (!this.mapElement) {
      return;
    }
    if (this.mapInitializationProcess) {
      this.MapHelper.initMap(this.mapElement);
    }
    this.setInitialMapView();
    this.mapInitializationProcess = false;
  }

  private setInitialMapView(): void {
    const reversedCoords: LatLngTuple = [...this.defaultMapCenter].reverse() as LatLngTuple;
    const zoom: number = 6;
    this.MapHelper.map!.setView(reversedCoords, zoom);
  }

  private resetMapAndHistory(): void {
    // return to initial map state
    this.clearMap();
    this.setInitialMapView();
    this.selectPath('level=0');
    this.MapHelper.removeStaticMarkers();
    this.history = [];
  }
}
