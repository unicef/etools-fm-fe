class VisitDetails extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.RouteHelperMixin,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'visit-details'; }

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            lastTab: String,
            tabs: {
                type: Array,
                value: () => [
                    {name: 'details', query: 'details'},
                    {name: 'overview', query: 'overview'},
                    {name: 'data collection', query: 'data-collection'},
                    {name: 'summary', query: 'summary'},
                    {name: 'attachments', query: 'attachments'}
                ]
            }
        };
    }

    public static get observers() {
        return [
            '_routeChanged(route.path, routeData.id)'
        ];
    }

    public _routeChanged(path: string, id: number) {
        const prefix = R.pathOr('', ['route', 'prefix'], this);
        if (!~prefix.indexOf('visit-details')) { return; }
        console.log(path, id);
        // if (!path.match(/[^\\/]/g)) {
        //     this.set('route.path', '/visits-list');
        // }
    }

    public setSites() {
        return R.clone(this.selectedSites);
    }

    public connectedCallback() {
        super.connectedCallback();

        this.sitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['specificLocations'], store),
            (sites: IStatedListData<Site> | undefined) => {
                if (!sites) { return; }
                this.sites = sites.results || [];
            });

        this.locationsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'locations'], store),
            (locations: Location[] | undefined) => {
                if (!locations) { return; }
                this.locations = locations;
            });
    }
}

customElements.define(VisitDetails.is, VisitDetails);
