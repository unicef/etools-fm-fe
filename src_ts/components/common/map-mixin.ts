const TILE_LAYER: Readonly<string> = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
const TILE_LAYER_LABELS: Readonly<string> = 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png';
const arcgisWebmapId = '71608a6be8984b4694f7c613d7048114'; // Default WebMap ID
const arcgisWebMapDataUrl = `https://www.arcgis.com/sharing/rest/content/items/${arcgisWebmapId}/data?f=json`;

interface ArcgisTargetGeometry {
  xmin?: number;
  ymin?: number;
  xmax?: number;
  ymax?: number;
  x?: number;
  y?: number;
}

interface ArcgisWebMapLayer {
  id?: string;
  layerType?: string;
  templateUrl?: string;
  url?: string;
  opacity?: number;
  visibility?: boolean;
  title?: string;
}

interface ArcgisWebMapData {
  baseMap?: {
    baseMapLayers?: ArcgisWebMapLayer[];
  };
  operationalLayers?: ArcgisWebMapLayer[];
  initialState?: {
    viewpoint?: {
      targetGeometry?: ArcgisTargetGeometry;
    };
  };
}

export interface IMarker extends L.Marker {
  staticData?: any;
}

export class MapHelper {
  map: L.Map | null = null;
  webmap!: GenericObject;
  staticMarkers: IMarker[] | null = null;
  dynamicMarker: IMarker | null = null;
  markerClusters: any | null = null;
  private arcgisWebMapData: ArcgisWebMapData | null = null;
  private arcgisWebMapPromise: Promise<ArcgisWebMapData> | null = null;

  arcgisMapIsAvailable(): Promise<boolean> {
    return fetch(`https://www.arcgis.com/sharing/rest/content/items/${arcgisWebmapId}?f=json`)
      .then((res) => res.json())
      .then((data) => {
        return !data.error;
      })
      .catch((e: any) => {
        console.log('arcgisMapIsAvailable error: ', e);
        return false;
      });
  }

  loadScript(src: string) {
    return new Promise((resolve) => {
      var list = document.getElementsByTagName('script');
      var i = list.length;
      while (i--) {
        if (list[i].src.includes(src)) {
          resolve(true);
          return;
        }
      }

      const script = document.createElement('script');
      script.src = src;
      script.onload = function () {
        resolve(true);
      };

      document.head.append(script);
    });
  }

  async initMap(element: HTMLElement) {
    if (!element) {
      throw new Error('Please provide HTMLElement for map initialization!');
    }

    const arcgisMapIsAvailable = JSON.parse(localStorage.getItem('arcgisMapIsAvailable') || '');
    await this.loadScript('node_modules/leaflet/dist/leaflet.js');
    await this.loadScript('node_modules/esri-leaflet/dist/esri-leaflet.js');
    await this.loadScript('node_modules/leaflet.markercluster/dist/leaflet.markercluster.js');
    return arcgisMapIsAvailable ? this.initArcgisMap(element) : this.initOpenStreetMap(element);
  }

  initOpenStreetMap(element: HTMLElement): void {
    L.Icon.Default.imagePath = '/fm/assets/images/';
    this.map = L.map(element);
    L.tileLayer(TILE_LAYER, {pane: 'tilePane'}).addTo(this.map);
    L.tileLayer(TILE_LAYER_LABELS, {pane: 'overlayPane'}).addTo(this.map);
    // compliance for waitForMapToLoad
    setTimeout(() => {
      this.webmap = {_loaded: true};
    }, 10);
  }

  initArcgisMap(mapElement: HTMLElement): void {
    this.loadArcgisMap(mapElement).catch((error: any) => {
      console.error('Failed to initialize ArcGIS map, falling back to OpenStreetMap', error);
      this.initOpenStreetMap(mapElement);
    });
  }

  setStaticMarkers(markersData: MarkerDataObj[]): void {
    this.removeStaticMarkers();
    const markers: L.Marker[] = [];
    markersData.forEach((data: MarkerDataObj) => {
      const marker: IMarker = this.createMarker(data);
      markers.push(marker);
    });
    this.staticMarkers = markers;
  }

  waitForMapToLoad(): Promise<boolean> {
    return new Promise((resolve) => {
      const interval = setInterval(() => {
        if (!(this.webmap && this.webmap._loaded)) {
          return;
        }
        clearInterval(interval);
        resolve(true);
      }, 100);
    });
  }

  addCluster(markersData: MarkerDataObj[], onclick?: (e: any) => void): void {
    this.markerClusters = (L as any).markerClusterGroup();
    const markers: L.Marker[] = [];
    let marker: IMarker;
    (markersData || []).forEach((mark: MarkerDataObj) => {
      marker = L.marker(mark.coords).bindPopup(`<b>${mark.popup}</b>`);
      marker.staticData = mark.staticData;
      if (onclick) {
        marker.on('click', function (e) {
          onclick(e);
        });
      }
      markers.push(marker);
      this.markerClusters.addLayer(marker);
    });
    (this.map as L.Map).setMaxZoom(19);
    (this.map as L.Map).addLayer(this.markerClusters);
    this.staticMarkers = markers;
  }

  addStaticMarker(markerData: MarkerDataObj): void {
    if (!this.staticMarkers) {
      this.staticMarkers = [];
    }
    const marker: IMarker = this.createMarker(markerData);
    this.staticMarkers.push(marker);
  }

  removeStaticMarkers(): void {
    if (this.map && this.staticMarkers && this.staticMarkers.length) {
      this.staticMarkers.forEach((marker: L.Marker) => marker.removeFrom(this.map as L.Map));
      this.staticMarkers = [];
    }
  }

  removeStaticMarker(dataId: number): void {
    const markers: IMarker[] = this.staticMarkers || [];
    const index: number = markers.findIndex(({staticData}: any) => staticData && staticData.id === dataId);
    if (~index && this.staticMarkers) {
      this.staticMarkers[index].removeFrom(this.map as L.Map);
      this.staticMarkers.splice(index, 1);
    }
  }

  markerExists(dataId: number): boolean {
    return !!(
      this.staticMarkers && ~this.staticMarkers.findIndex(({staticData}: any) => staticData && staticData.id === dataId)
    );
  }

  reCheckMarkers(dataIds: number[]): void {
    const markers: IMarker[] = this.staticMarkers || [];
    const markersForRemove: IMarker[] = markers.filter(
      ({staticData}: any) => staticData && !~dataIds.indexOf(staticData.id)
    );
    markersForRemove.forEach(({staticData}: any) => this.removeStaticMarker(staticData.id));
  }

  addDynamicMarker(cordinates: [number, number]): void {
    if (!this.map) {
      throw new Error('Please, initialize map!');
    }
    this.removeDynamicMarker();
    this.dynamicMarker = L.marker(cordinates).addTo(this.map);
  }

  changeDMLocation(cordinates: [number, number]): void {
    if (!this.map) {
      throw new Error('Please, initialize map!');
    }
    if (!this.dynamicMarker) {
      this.addDynamicMarker(cordinates);
    } else {
      this.dynamicMarker.setLatLng(cordinates);
    }
  }

  removeDynamicMarker(): void {
    if (!this.map) {
      throw new Error('Please, initialize map!');
    }
    if (this.dynamicMarker) {
      this.dynamicMarker.removeFrom(this.map);
    }
  }

  invalidateSize(): L.Map | null {
    return this.map && this.map.invalidateSize();
  }

  private createMarker(data: MarkerDataObj): IMarker {
    const marker: IMarker = L.marker(data.coords).addTo(this.map as L.Map);
    marker.staticData = data.staticData;
    if (data.popup) {
      marker.bindPopup(`<b>${data.popup}</b>`);
    }

    return marker;
  }

  private async loadArcgisMap(mapElement: HTMLElement): Promise<void> {
    const webMapData = await this.getArcgisWebMapData();
    const map = L.map(mapElement, {maxZoom: 20, minZoom: 2});
    this.map = map;
    this.webmap = {_map: map, _loaded: false};
    const baseLayers = webMapData.baseMap?.baseMapLayers || [];
    const operationalLayers = webMapData.operationalLayers || [];

    this.applyArcgisInitialViewpoint(map, webMapData);
    [...baseLayers, ...operationalLayers].forEach((layer) => this.addArcgisLayerToMap(map, layer));
    this.webmap._loaded = true;
  }

  private getArcgisWebMapData(): Promise<ArcgisWebMapData> {
    if (this.arcgisWebMapData) {
      return Promise.resolve(this.arcgisWebMapData);
    }

    if (!this.arcgisWebMapPromise) {
      this.arcgisWebMapPromise = fetch(arcgisWebMapDataUrl)
        .then((res) => res.json())
        .then((data: ArcgisWebMapData) => {
          this.arcgisWebMapData = data;
          return data;
        })
        .catch((error) => {
          this.arcgisWebMapPromise = null;
          throw error;
        });
    }

    return this.arcgisWebMapPromise;
  }

  private applyArcgisInitialViewpoint(map: L.Map, data: ArcgisWebMapData): void {
    const geometry = data.initialState?.viewpoint?.targetGeometry;
    if (!geometry) {
      map.setView([0, 0], 2);
      return;
    }

    if (
      typeof geometry.xmin === 'number' &&
      typeof geometry.ymin === 'number' &&
      typeof geometry.xmax === 'number' &&
      typeof geometry.ymax === 'number'
    ) {
      const sw = L.CRS.EPSG3857.unproject(L.point(geometry.xmin, geometry.ymin));
      const ne = L.CRS.EPSG3857.unproject(L.point(geometry.xmax, geometry.ymax));
      map.fitBounds(L.latLngBounds(sw, ne), {animate: false});
      return;
    }

    if (typeof geometry.x === 'number' && typeof geometry.y === 'number') {
      const center = L.CRS.EPSG3857.unproject(L.point(geometry.x, geometry.y));
      map.setView(center, 4);
      return;
    }

    map.setView([0, 0], 2);
  }

  private addArcgisLayerToMap(map: L.Map, layer: ArcgisWebMapLayer | undefined): void {
    if (!layer || layer.visibility === false) {
      return;
    }

    const opacity = typeof layer.opacity === 'number' ? layer.opacity : 1;
    switch (layer.layerType) {
      case 'WebTiledLayer':
        if (!layer.templateUrl) {
          console.warn('ArcGIS WebTiledLayer missing templateUrl', layer);
          return;
        }
        L.tileLayer(this.normalizeTemplateUrl(layer.templateUrl), {
          opacity,
          detectRetina: layer.templateUrl.includes('@2x')
        }).addTo(map);
        return;
      case 'ArcGISTiledMapServiceLayer':
        if (layer.url && (L as any).esri?.tiledMapLayer) {
          (L as any).esri.tiledMapLayer({url: layer.url, opacity}).addTo(map);
        }
        return;
      case 'ArcGISFeatureLayer':
        if (layer.url && (L as any).esri?.featureLayer) {
          (L as any).esri.featureLayer({url: layer.url, opacity}).addTo(map);
        }
        return;
      case 'ArcGISMapServiceLayer':
        if (layer.url && (L as any).esri?.dynamicMapLayer) {
          (L as any).esri.dynamicMapLayer({url: layer.url, opacity}).addTo(map);
        }
        return;
      default:
        console.warn(`Unsupported ArcGIS layer type: ${layer.layerType || 'undefined'}`, layer);
    }
  }

  private normalizeTemplateUrl(templateUrl: string): string {
    return templateUrl
      .replace(/\{level\}/gi, '{z}')
      .replace(/\{col\}/gi, '{x}')
      .replace(/\{row\}/gi, '{y}');
  }
}
