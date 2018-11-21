class OverviewPlaning extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'overview-planing'; }

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            tabs: {
                type: Array,
                value: () => [
                    {name: 'rationale', query: 'rationale'},
                    {name: 'co overview', query: 'co-overview'},
                    {name: 'plan by tasks', query: 'plan-by-tasks'},
                    {name: 'checklist', query: 'checklist'},
                    {name: 'preparation', query: 'preparation'}
                ]
            }
        };
    }

    public static get observers() {
        return [
            '_routeChanged(route.path)'
        ];
    }

    public _routeChanged(path: string) {
        const prefix = _.get(this, 'route.prefix', '');
        if (!~prefix.indexOf('overview-planing')) { return; }
        if (!path.match(/[^\\/]/g)) {
            this.set('route.path', '/rationale');
        }
    }

    public connectedCallback() {
        super.connectedCallback();
        const currentYear = new Date().getFullYear();
        this.yearOptions = [currentYear - 1, currentYear].map(year => ({label: year, value: year}));
        this.selectedYear = currentYear;
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.yearPlanSubscriber();
    }

    public showYearAndInfo(tabName: string, ...showIn: string[]): boolean {
        return !!~showIn.indexOf(tabName);
    }

    public onYearSelected() {
    }
}

customElements.define(OverviewPlaning.is, OverviewPlaning);
