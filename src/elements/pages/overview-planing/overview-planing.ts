class OverviewPlaning extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.PermissionController,
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
        this.logIssueAllowSubscribe = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.logIssues'),
            (permissions: IBackendPermissions) => { this.logIssuesPermissions = permissions; });
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

    public _isShowLogIssue(tab: string, permissions: IPermissionActions) {
        return (tab === 'preparation' && permissions && this.actionAllowed(permissions, 'create'));
    }

    public _onCreateLogIssue() {
        const preparationTab = this.shadowRoot.querySelector('preparation-tab');
        preparationTab.dispatchEvent(new CustomEvent('create-log-issue', {bubbles: true, composed: true}));
    }
}

customElements.define(OverviewPlaning.is, OverviewPlaning);
