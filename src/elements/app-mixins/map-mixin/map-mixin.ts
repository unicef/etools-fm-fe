import { Marker } from 'leaflet';

const TILE_LAYER = 'http://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png';

window.FMMixins = window.FMMixins || {};
window.FMMixins.MapMixin = (superClass: any) => class extends FMMixins.AppConfig(superClass) {
    public initMap(element: HTMLElement) {
        L.Icon.Default.imagePath = this.getAbsolutePath('images/');
        this.map = L.map(element);
        L.tileLayer(TILE_LAYER).addTo(this.map);
        return this.map;
    }

    public setStaticMarkers(markersData: MarkerDataObj[]) {
        this.removeStaticMarkers();
        const markers: Marker[] = [];
        _.each(markersData, (data: MarkerDataObj) => {
            const marker = L.marker(data.coords).addTo(this.map);
            marker.staticData = data.staticData;
            if (data.popup) {
                marker.bindPopup(`<b>${data.popup}</b>`);
            }
            markers.push(marker);
        });
        this.staticMarkers = markers;
    }

    public removeStaticMarkers() {
        if (this.staticMarkers && this.staticMarkers.length) {
            _.each(this.staticMarkers, (marker: Marker) => {
                marker.removeFrom(this.map);
            });
        }
    }
    //
    // public toggleStaticMarkers(show: boolean) {
    //
    // }

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
};