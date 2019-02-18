import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getEndpoint } from '../../../app-config/app-config';
import { updateYearPlan } from '../../../redux-store/effects/year-paln.effects';

class RationaleTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.TextareaMaxRowsMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {

    public static get is() { return 'rationale-tab'; }

    public static get properties() {
        return {
            selectedYear: {
                type: Number,
                notify: true
            }
        };
    }

    public onYearSelected({detail}: CustomEvent) {
        const year = detail.selectedItem.value;
        if (year) {
            const endpoint = getEndpoint('yearPlan', { year });
            this.dispatchOnStore(loadPermissions(endpoint.url, 'yearPlan'));
        }
        if (year && this.isActive) {
            this.updateQueryParams({ year });
        } else if (year) {
            this.queryParams = { year };
        }
    }

    public formatValue(value: string) {
        const isEmptyValue = value === null || value === undefined || value === '' && !Array.isArray(value);
        return Array.isArray(value) && !value.length || isEmptyValue ?
            '...' : value;
    }

    public openEditDialog() {
        this.dialog = {opened: true};
        this.selectedModel = R.clone(this.yearPlan);
        this.originalModel =  R.clone(this.yearPlan);
    }

    public onFinishEdit() {
        if (R.equals(this.selectedModel, this.originalModel)) {
            this.dialog = { opened: false };
            return;
        }
        const changes = this.changesToRequest(this.originalModel, this.selectedModel, this.permissions);
        this.dispatchOnStore(updateYearPlan(this.selectedYear, changes));
    }

    public connectedCallback() {
        super.connectedCallback();

        const currentYear = new Date().getFullYear();
        this.yearOptions = [currentYear, currentYear + 1].map(year => ({label: year, value: year}));

        this.yearPlanSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['yearPlan', 'data'], store),
            (yearPlan: YearPlan) => { this.yearPlan = yearPlan; });

        this.permissionSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'yearPlan'], store),
            (permissions: IBackendPermissions) => { this.permissions = permissions; });

        this.requestYearPlanSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['yearPlan', 'requestInProcess'], store),
            (requestInProcess: boolean | null) => {
                this.requestInProcess = requestInProcess;
                if (requestInProcess !== false) { return; }

                this.errors = this.getFromStore('yearPlan.errors');
                if (this.errors) { return; }

                this.dialog = {opened: false};
            });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.permissionSubscriber();
        this.requestYearPlanSubscriber();
    }

    public finishLoad() { }

    public onTargetVisitsChange({target}: CustomEvent) {
        if (!target) { return; }
        let value = R.path(['value'], target);
        value = +value || 0;
        // @ts-ignore
        target.value = value;
    }

    public getChangesDate(date: string) {
        return date ? moment(date).format('DD MMM YYYY') : '';
    }
}

customElements.define(RationaleTab.is, RationaleTab);
