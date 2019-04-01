class DetailsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.RouteHelperMixin,
    FMMixins.ReduxMixin, FMMixins.CommonMethods], Polymer.Element) {
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
            },
            startDateLimit: {
                type: Date,
                value: () => new Date()
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener('action-activated', ({ detail }: CustomEvent) => console.log(detail));

        this.visitSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['visitDetails', 'data'], store),
            (visit: Visit | undefined) => {
                if (!visit) { return; }
                this.originalData = R.clone(visit);
                this.visit = R.clone(visit);
            });

        this.visitPermissionsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['visitDetails', 'permissions'], store),
            (visitPermissions: IPermissionActions | undefined) => {
                if (!visitPermissions) { return; }
                this.permissions = R.clone(visitPermissions);
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

    public openDatepicker(event: HTMLElementEvent<HTMLElement>) {
        event.preventDefault();
        const id = R.path(['target', 'dataset', 'datePicker'], event);
        if (!this.permissions || !id) { return; }

        const isReadonly = this.getReadonlyStatus(this.permissions, id);
        const dialog = R.path([id], this.$);
        if (!dialog || isReadonly) { return; }
        dialog.open = true;
    }

    public displayDate(date: string) {
        return moment(date).format('MMMM DD, YYYY');
    }

    public getMinStartDate() {
        const date = new Date();
        const {year, month, day} = this.parseDate(date);
        return new Date(year, month, day);
    }

    public getMaxStartDate(date: Date) {
        const {year, month, day} = this.parseDate(date);
        const today = new Date(year, month, day);
        return new Date(today.getTime() - 1);
    }

    private parseDate(date: Date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        return {year, month, day};
    }
}

customElements.define(DetailsTab.is, DetailsTab);
