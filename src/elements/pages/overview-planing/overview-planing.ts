import { loadYearPlan } from '../../redux-store/effects/year-paln.effects';

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
        this.yearOptions = [currentYear, currentYear + 1].map(year => ({label: year, value: year}));
        this.selectedYear = currentYear;

        this.yearPlanSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['yearPlan', 'data'], store),
            (yearPlan: YearPlan) => { this.yearPlan = yearPlan; });

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

    public showYearAndInfo(tabName: string, ...showIn: string[]): boolean {
        return !!~showIn.indexOf(tabName);
    }

    public onYearSelected() {
        this.dispatchOnStore(loadYearPlan(this.selectedYear));
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
}

customElements.define(OverviewPlaning.is, OverviewPlaning);
