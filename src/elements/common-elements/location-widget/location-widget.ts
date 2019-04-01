import { loadLocationPath, loadWidgetLocations } from '../../redux-store/effects/widget-locations.effects';
import { getLocationPart } from '../get-location-part';
import { locationsInvert } from '../../pages/settings/sites-tab/locations-invert';
import { loadSiteLocations } from '../../redux-store/effects/site-specific-locations.effects';
import { properties } from './location-widget.properties';

const POLYGON_OPTIONS = {color: '#eddaa3', stroke: false, fillOpacity: 0.8, pane: 'tilePane'};

class LocationWidget extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ReduxMixin,
    FMMixins.MapMixin], Polymer.Element) {
    public static get is() { return 'location-widget'; }

    public static get properties() {
        return properties;
    }

    public static get observers() {
        return [
            'checkSelectedSites(selectedSites, selectedLocation, currentList)',
            'restoreHistory(selectedLocation, loadingInProcess)'
        ];
    }

    public connectedCallback() {
        super.connectedCallback();
        this.mapInitializationProcess = true;

        if (!this.getFromStore('specificLocations.results')) {
            this.dispatchOnStore(loadSiteLocations());
        }

        this.currentWorkspaceSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'currentWorkspace'], store),
            (workspace: Workspace | undefined) => {
                if (!workspace) { return; }
                this.defaultMapCenter = R.pathOr([-0.09, 51.505], ['point', 'coordinates'], workspace);
                this.mapInitialisation();
            });

        this.widgetLocationsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['widgetLocationsStore', 'data'], store),
            (widgetLocationsStore: WidgetStoreData | undefined) => {
                if (!widgetLocationsStore) { return; }
                this.widgetLocations = Object.assign({}, this.widgetLocations, widgetLocationsStore);

                if (!widgetLocationsStore['level=0']) {
                    this.dispatchOnStore(loadWidgetLocations('level=0'));
                }
            });

        this.widgetLoadingSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['widgetLocationsStore', 'loading'], store),
            (loading: boolean | undefined) => {
                if (!R.is(Boolean, loading)) { return; }
                this.listLoading = loading;
            });

        this.pathLoadingSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['widgetLocationsStore', 'pathLoading'], store),
            (pathLoading: boolean | undefined) => {
                if (!R.is(Boolean, pathLoading)) { return; }
                this.pathLoading = pathLoading;
                if (!pathLoading && this.selectedLocation && !this.loadingInProcess) {
                    this.restoreHistory(this.selectedLocation);
                }
            });

        this.sitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['specificLocations'], store),
            (sites: IStatedListData<Site> | undefined) => {
                if (!sites) { return; }
                const sitesObject = sites.results || [];

                const convertedSites = locationsInvert(sitesObject)
                    .map((location: IGroupedSites) => [`sites_for_${location.id}`, location.sites])
                    .reduce((reducedLocations: {[key: string]: Site[]}, pair: [string, Site[]]) => {
                        const [key, groupedSites] = pair;
                        return Object.assign({}, reducedLocations, {[key]: groupedSites});
                    }, {});

                this.widgetLocations = Object.assign({}, this.widgetLocations, convertedSites);
            });
    }

    public onLocationLineClick({ model }: EventModel<WidgetLocation>) {
        const { location }: Model<WidgetLocation> = model || {};

        this.push('history', location);
        this.selectLocation(location);
        this.locationSearch = '';
    }

    public selectLocation(location: WidgetLocation) {
        this.centerAndDrawBorders(location);

        const { is_leaf: isLeaf, id } = location;
        const parent = isLeaf ? `sites_for_${id}` : `parent=${id}`;

        this.selectedLocation = isLeaf ? location.id : null;
        this.selectPath(parent, isLeaf);
    }

    public onSiteLineClick({ model }: EventModel<Site>) {
        const { location }: Model<Site> = model || {};
        const index = this.selectedSites.findIndex((id: number) => id === location.id);

        if (!~index && !this.multipleSites) {
            this.removeStaticMarkers();
            this.selectedSites.splice(0);
        }

        if (!~index) {
            this.push('selectedSites', location.id);
            const coords = R.clone(location.point.coordinates).reverse();
            this.addStaticMarker({coords, staticData: location, popup: location.name});
        } else {
            this.splice('selectedSites', index, 1);
            this.removeStaticMarker(location.id);
        }

        if (!this.multipleSites) {
            const id = !~index ? location.id : null;
            this.set('selectedSite', id);
        }
    }

    public selectedSiteChanged(site: number | null) {
        if (this.multipleSites) { return; }

        const exist = this.selectedSites.findIndex((id: number) => id === site);
        if (!site && this.selectedSites.length) {
            this.set('selectedSites', []);
        } else if (site && !~exist) {
            this.set('selectedSites', [site]);
        }
    }

    public onSiteHoverStart({ model, target }: EventModel<Site>) {
        const alreadySelected = target.classList.contains('selected');
        if (alreadySelected) { return; }

        const { location }: Model<Site> = model || {};
        const coords = R.clone(location.point.coordinates).reverse();
        this.addDynamicMarker(coords);
    }

    public onSiteHoverEnd() {
        this.removeDynamicMarker();
    }

    public removeFromHistory({ model }: EventModel<WidgetLocation>) {
        const { location }: Model<WidgetLocation> = model || {};
        const index = this.history.findIndex((historyLocation: WidgetLocation) => historyLocation.id === location.id);
        if (!~index) { return; }

        this.splice('history', index);

        this.removeStaticMarkers();
        this.selectedSites = [];
        this.selectedSite = null;
        this.selectedLocation = null;
        this.locationSearch = '';

        const currentLocation = this.history[index - 1];
        if (!currentLocation) {
            // return to initial map state
            this.resetMapAndHistory();
        } else {
            this.selectLocation(currentLocation);
        }
    }

    // method to restore history if selectedLocation come outside component
    public restoreHistory(locationId: string | null, loading?: boolean) {
        if (!locationId || loading) { return; }

        const lastLocation = this.getLastLocation();
        if (lastLocation && lastLocation.id === locationId) { return; }

        const history = this.getFromStore(`widgetLocationsStore.pathCollection.${locationId}`);
        if (!history) {
            this.dispatchOnStore(loadLocationPath(locationId));
            return;
        } else if (history.length === 0) { return; }

        const currentLocation = this.getLastLocation(history);
        if (!currentLocation.is_leaf) {
            console.warn('Selected Location must be low level!');
            this.selectedLocation = null;
            this.resetMapAndHistory();
            return;
        }

        this.history = R.clone(history);
        this.selectLocation(currentLocation);
    }

    public checkSelectedSites(selectedSites: number[], selectedLocation: string, currentList: string) {
        if (selectedSites.length && !selectedLocation) {
            this.selectedSites = [];
            this.selectedSite = null;
            return;
        }

        if (!selectedSites.length || currentList !== `sites_for_${selectedLocation}`) { return; }

        const sitesList = this.widgetLocations[currentList] || [];
        const missingSites = selectedSites.filter(
            (siteId: number) => sitesList.findIndex((site: Site) => site.id === siteId) === -1
        );

        if (missingSites.length !== 0) {
            console.warn(`This sites are missing in list: ${missingSites}. They will be removed from selected`);
            this.selectedSites = selectedSites.filter((siteId: number) => !~missingSites.indexOf(siteId));
            missingSites.forEach((siteId: number) => this.removeStaticMarker(siteId));
            this.selectedSite = null;
        }

        this.selectedSites.forEach((siteId: number) => {
            const exists = this.markerExists(siteId);
            if (exists) { return; }

            const missingSite = sitesList.find((site: Site) => site.id === siteId);
            const coords = R.clone(missingSite.point.coordinates).reverse();
            this.addStaticMarker({coords, staticData: missingSite, popup: missingSite.name});
        });
        this.reCheckMarkers(this.selectedSites);
    }

    public getHistoryInputLabel(gateway: LocationGateway) {
        const { admin_level: level, name }: LocationGateway = gateway || {};
        const levelString = !level && level !== 0 ? '' : `Admin ${level} - `;
        return (!level && !name) ? '' : `${levelString}${name}`;
    }

    public searchChanged() {
        this.$.locationsList.render();
    }

    public locationsFilter(location: WidgetLocation) {
        return !this.locationSearch || !!~location.name
            .toLocaleLowerCase()
            .indexOf(this.locationSearch.toLocaleLowerCase());
    }

    public showSiteLine(geometry: any) {
        return !geometry;
    }

    public getSiteLineClass(siteId: number) {
        const isSelected = this.selectedSites.findIndex((id: number) => id === siteId);
        return !~isSelected ? '' : 'selected';
    }

    public hideEmptySitesMessage(path: string, loading: boolean) {
        const lastLocation = this.getLastLocation() || {};
        const isLeaf = lastLocation.is_leaf;
        const isListEmpty = this.getListItems(path).length === 0;

        return loading || !isLeaf || !isListEmpty;
    }

    public checkLoading(...loadings: boolean[]) {
        return loadings.some(loading => loading);
    }

    public getListItems(path: string, loading?: boolean) {
        return !loading && path && this.widgetLocations && this.widgetLocations[path] || [];
    }

    public getLocationPart(location: string = '', partToSelect: string) {
        return getLocationPart(location, partToSelect);
    }

    public goToSettings() {
        history.pushState({}, '', '/fm/settings/sites');
        window.dispatchEvent(new CustomEvent('location-changed'));
    }

    public updateMap() {
        this.invalidateSize();

        const location = this.getLastLocation();
        if (location) {
            this.centerAndDrawBorders(location);
        }
    }

    private centerAndDrawBorders(location: WidgetLocation) {
        this.clearMap();

        const polygonCoordinates = (location.geom.coordinates || []).flat().flat();
        const pointCoordinates = location.point.coordinates;
        const polygonIsEmpty = R.isEmpty(polygonCoordinates);

        const coordinates = polygonIsEmpty ? [pointCoordinates] : polygonCoordinates;
        const reversedCoordinates = coordinates.map((coordinate) => R.clone(coordinate).reverse());
        const options = polygonIsEmpty ? {maxZoom: this.map.getZoom()} : {};
        this.map.flyToBounds(reversedCoordinates, options);

        if (!polygonIsEmpty) {
            this.polygone = L.polygon(reversedCoordinates, POLYGON_OPTIONS);
            this.polygone.addTo(this.map);
        }
    }

    private getLastLocation(history?: WidgetLocation[]): WidgetLocation {
        const historyArray = history || this.history;
        const lastLocationIndex = historyArray.length - 1;
        return historyArray[lastLocationIndex] || null;
    }

    private selectPath(path: string, isLeaf?: boolean) {
        if (!isLeaf && !this.widgetLocations[path]) {
            this.dispatchOnStore(loadWidgetLocations(path));
        }

        this.currentList = path;
    }

    private clearMap() {
        if (this.polygone) {
            this.polygone.removeFrom(this.map);
            this.polygone = null;
        }
    }

    private resetMapAndHistory() {
        // return to initial map state
        this.clearMap();
        this.setInitialMapView();
        this.selectPath('level=0');
        this.removeStaticMarkers();
        this.history = [];
    }

    private setInitialMapView() {
        const reversedCoords = R.clone(this.defaultMapCenter).reverse();
        const zoom = 6;
        this.map.setView(reversedCoords, zoom);
    }

    private mapInitialisation() {
        this.initMap(this.$.map);
        setTimeout(() => {
            this.setInitialMapView();
            this.mapInitializationProcess = false;
        }, 1000);
    }
}

customElements.define(LocationWidget.is, LocationWidget);
