import { Marker } from 'leaflet';

const TILE_LAYER = 'https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png';
const TILE_LAYER_LABELS = 'https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png';

window.FMMixins = window.FMMixins || {};
window.FMMixins.MapMixin = (superClass: any) => class extends FMMixins.AppConfig(superClass) {
    public initMap(element: HTMLElement) {
        L.Icon.Default.imagePath = this.getAbsolutePath('images/');
        this.map = L.map(element);
        L.tileLayer(TILE_LAYER, {pane: 'tilePane'}).addTo(this.map);
        L.tileLayer(TILE_LAYER_LABELS, {pane: 'overlayPane'}).addTo(this.map);
        return this.map;
    }

    public setStaticMarkers(markersData: MarkerDataObj[]) {
        this.removeStaticMarkers();
        const markers: Marker[] = [];
        R.forEach((data: MarkerDataObj) => {
            const marker = this.createMarker(data);
            markers.push(marker);
        }, markersData);
        this.staticMarkers = markers;
    }

    public addStaticMarker(markerData: MarkerDataObj) {
        if (!this.staticMarkers) {
            this.staticMarkers = [];
        }
        const marker = this.createMarker(markerData);
        this.push('staticMarkers', marker);

    }

    public removeStaticMarkers() {
        if (this.staticMarkers && this.staticMarkers.length) {
            R.forEach((marker: Marker) => {
                marker.removeFrom(this.map);
            }, this.staticMarkers);
            this.staticMarkers = [];
        }
    }

    public removeStaticMarker(dataId: number) {
        const markers = this.staticMarkers || [];
        const index = markers.findIndex(({staticData}: any) => staticData && staticData.id === dataId);
        if (~index) {
            this.staticMarkers[index].removeFrom(this.map);
            this.staticMarkers.splice(index, 1);
        }
    }

    public markerExists(dataId: number) {
        return !!(this.staticMarkers && ~this.staticMarkers.findIndex(
            ({staticData}: any) => staticData && staticData.id === dataId)
        );
    }

    public reCheckMarkers(dataIds: number[]) {
        const markers = this.staticMarkers || [];
        const markersForRemove = markers.filter(({staticData}: any) => staticData && !~dataIds.indexOf(staticData.id));
        markersForRemove.forEach(({staticData}: any) => this.removeStaticMarker(staticData.id));
    }

    public addDynamicMarker(cordinates: [number, number]) {
        if (!this.map) { throw new Error('Please, initialize map!'); }
        this.removeDynamicMarker();
        this.dynamicMarker = L.marker(cordinates).addTo(this.map);
    }

    public changeDMLocation(cordinates: [number, number]) {
        if (!this.map) { throw new Error('Please, initialize map!'); }
        if (!this.dynamicMarker) {
            this.addDynamicMarker(cordinates);
        } else {
            this.dynamicMarker.setLatLng(cordinates);
        }
    }

    public removeDynamicMarker() {
        if (!this.map) { throw new Error('Please, initialize map!'); }
        if (this.dynamicMarker) {
            this.dynamicMarker.removeFrom(this.map);
        }
    }

    public invalidateSize() {
        return this.map && this.map.invalidateSize();
    }

    private createMarker(data: MarkerDataObj) {
        const marker = L.marker(data.coords).addTo(this.map);
        marker.staticData = data.staticData;
        if (data.popup) {
            marker.bindPopup(`<b>${data.popup}</b>`);
        }

        return marker;
    }
};
