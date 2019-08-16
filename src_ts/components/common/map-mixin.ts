// import 'leaflet';
import { Map, Marker } from 'leaflet';

const TILE_LAYER: Readonly<string> = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
const TILE_LAYER_LABELS: Readonly<string> = 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png';

export interface IMarker extends Marker {
    staticData?: any;
}

export class MapHelper {
    public map: Map | null = null;
    public staticMarkers: IMarker[] | null = null;
    public dynamicMarker: IMarker | null = null;

    public initMap(element?: HTMLElement | null): Map | never {
        if (!element) {
            throw new Error('Please provide HTMLElement for map initialization!');
        }
        L.Icon.Default.imagePath = '/fm/images/';
        this.map = L.map(element);
        L.tileLayer(TILE_LAYER, { pane: 'tilePane' }).addTo(this.map);
        L.tileLayer(TILE_LAYER_LABELS, { pane: 'overlayPane' }).addTo(this.map);
        return this.map;
    }

    public setStaticMarkers(markersData: MarkerDataObj[]): void {
        this.removeStaticMarkers();
        const markers: Marker[] = [];
        markersData.forEach((data: MarkerDataObj) => {
            const marker: IMarker = this.createMarker(data);
            markers.push(marker);
        });
        this.staticMarkers = markers;
    }

    public addStaticMarker(markerData: MarkerDataObj): void {
        if (!this.staticMarkers) {
            this.staticMarkers = [];
        }
        const marker: IMarker = this.createMarker(markerData);
        this.staticMarkers.push(marker);

    }

    public removeStaticMarkers(): void {
        if (this.map && this.staticMarkers && this.staticMarkers.length) {
            this.staticMarkers.forEach((marker: Marker) => marker.removeFrom(this.map as Map));
            this.staticMarkers = [];
        }
    }

    public removeStaticMarker(dataId: number): void {
        const markers: IMarker[] = this.staticMarkers || [];
        const index: number = markers.findIndex(({ staticData }: any) => staticData && staticData.id === dataId);
        if (~index && this.staticMarkers) {
            this.staticMarkers[index].removeFrom(this.map as Map);
            this.staticMarkers.splice(index, 1);
        }
    }

    public markerExists(dataId: number): boolean {
        return !!(this.staticMarkers && ~this.staticMarkers.findIndex(
                ({ staticData }: any) => staticData && staticData.id === dataId)
        );
    }

    public reCheckMarkers(dataIds: number[]): void {
        const markers: IMarker[] = this.staticMarkers || [];
        const markersForRemove: IMarker[] = markers.filter(({ staticData }: any) => staticData && !~dataIds.indexOf(staticData.id));
        markersForRemove.forEach(({ staticData }: any) => this.removeStaticMarker(staticData.id));
    }

    public addDynamicMarker(cordinates: [number, number]): void {
        if (!this.map) {
            throw new Error('Please, initialize map!');
        }
        this.removeDynamicMarker();
        this.dynamicMarker = L.marker(cordinates).addTo(this.map);
    }

    public changeDMLocation(cordinates: [number, number]): void {
        if (!this.map) {
            throw new Error('Please, initialize map!');
        }
        if (!this.dynamicMarker) {
            this.addDynamicMarker(cordinates);
        } else {
            this.dynamicMarker.setLatLng(cordinates);
        }
    }

    public removeDynamicMarker(): void {
        if (!this.map) {
            throw new Error('Please, initialize map!');
        }
        if (this.dynamicMarker) {
            this.dynamicMarker.removeFrom(this.map);
        }
    }

    public invalidateSize(): Map | null {
        return this.map && this.map.invalidateSize();
    }

    private createMarker(data: MarkerDataObj): IMarker {
        const marker: IMarker = L.marker(data.coords).addTo(this.map as Map);
        marker.staticData = data.staticData;
        if (data.popup) {
            marker.bindPopup(`<b>${data.popup}</b>`);
        }

        return marker;
    }

}
