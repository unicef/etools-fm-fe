class VisitAndDataCollection extends Polymer.Element {
    public static get is() { return 'visit-and-data-collection'; }

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            lastTab: String
        };
    }

    public static get observers() {
        return [
            '_routeChanged(route.path)'
        ];
    }

    public _routeChanged(path: string) {
        const prefix = R.pathOr('', ['route', 'prefix'], this);
        if (!~prefix.indexOf('visit-and-data-collection')) { return; }
        if (!path.match(/[^\\/]/g)) {
            this.set('route.path', '/visits-list');
        }
    }
}

customElements.define(VisitAndDataCollection.is, VisitAndDataCollection);
