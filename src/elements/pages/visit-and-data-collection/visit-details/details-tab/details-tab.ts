class DetailsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.RouteHelperMixin,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'details-tab'; }

    public static get properties() {
        return {
            multipleSites: {
                type: Boolean,
                value: false
            },
            widgetOpened: {
                type: Boolean,
                value: false
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();

        this.visitSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['visitDetails', 'data'], store),
            (visit: Visit | undefined) => {
                if (!visit) { return; }
                this.originalData = R.clone(visit);
                this.visit = R.clone(visit);
            });

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

    public widgetToggle() {
        this.widgetOpened = !this.widgetOpened;
        if (!this.widgetOpened) { return; }
        this.$.locationWidget.updateMap();
    }
}

customElements.define(DetailsTab.is, DetailsTab);
