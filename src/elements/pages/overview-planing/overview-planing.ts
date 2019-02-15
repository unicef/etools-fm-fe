import { loadYearPlan } from '../../redux-store/effects/year-paln.effects';

class OverviewPlaning extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.PermissionController,
    FMMixins.RouteHelperMixin,
    FMMixins.ReduxMixin], Polymer.Element) {
    public static get is() { return 'overview-planing'; }

    public static get properties() {
        return {
            selectedYear: {
                type: Number,
                observer: 'setYear'
            },
            route: {
                type: Object,
                notify: true
            },
            tabs: {
                type: Array,
                value: () => [
                    {name: 'rationale', query: 'rationale'},
                    {name: 'co overview', query: 'co-overview'},
                    {name: 'plan by task', query: 'plan-by-task'},
                    {name: 'checklist', query: 'checklist'},
                    {name: 'preparation', query: 'preparation'}
                ]
            },
            permissions: {
                type: Object,
                value: () => ({})
            },
            addBtnTexts: {
                type: Object,
                value: () => ({
                    'preparation': 'Log Issue',
                    'plan-by-task': 'Plan A Task'
                })
            },
            showAddButton: {
                type: Boolean,
                computed: 'checkAddBtn(routeData.tab, permissions.*)'
            }
        };
    }

    public static get observers() {
        return [
            '_routeChanged(route.path)'
        ];
    }

    public _routeChanged(path: string) {
        const prefix = R.pathOr('', ['route', 'prefix'], this);
        if (!~prefix.indexOf('overview-planing')) { return; }
        if (!path.match(/[^\\/]/g)) {
            this.set('route.path', '/rationale');
        }
    }

    public connectedCallback() {
        super.connectedCallback();

        const currentYear = new Date().getFullYear();
        const queryString = this.getQueryString();
        const queryParams = this.decodeParams(queryString);
        const yearFromParams = queryParams && queryParams.year;
        this.selectedYear = yearFromParams || currentYear;

        this.logIssueAllowSubscribe = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'logIssues'], store),
            (permissions: IBackendPermissions) => { this.set('permissions.preparation', permissions); });

        this.planByTaskAllowSubscribe = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'planingTasks'], store),
            (permissions: IBackendPermissions) => { this.set('permissions.plan-by-task', permissions); });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.yearPlanSubscriber();
    }

    public setYear(year: number) {
        this._debounceLoadYearPlan = Polymer.Debouncer.debounce(this._debounceLoadYearPlan,
            Polymer.Async.timeOut.after(100), () => {
                if (year) { this.dispatchOnStore(loadYearPlan(year)); }
            });
    }

    public checkTab(tabName: string, ...showIn: string[]): boolean {
        return !!~showIn.indexOf(tabName);
    }

    public checkAddBtn(tabName: string) {
        const permissions = this.permissions[tabName];
        const btnText = this.getAddBtnText(tabName);
        return !!btnText && !!permissions && this.actionAllowed(permissions, 'create');
    }

    public getAddBtnText(tab: string) {
        return this.addBtnTexts[tab] || '';
    }

    public addBtnClick() {
        const tab = this.shadowRoot.querySelector(`#${this.routeData.tab}`);
        tab.dispatchEvent(new CustomEvent('add-new', {bubbles: true, composed: true}));
    }

    public exportData() {
        const url = this.getEndpoint('issuesCSVExport').url;
        const params = this.getQueryString() || '';
        window.open(url + params, '_blank');
    }

    public printPage() {
        window.print();
    }
}

customElements.define(OverviewPlaning.is, OverviewPlaning);
