import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getEndpoint } from '../../../app-config/app-config';
import { updateYearPlan } from '../../../redux-store/effects/year-paln.effects';

class RationaleTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {

    public static get is() { return 'rationale-tab'; }

    public static get properties() {
        return {
            selectedYear: {
                type: Number,
                observer: 'setYear'
            }
        };
    }

    public setYear(year: number) {
        if (year) {
            const endpoint = getEndpoint('yearPlan', { year });
            this.dispatchOnStore(loadPermissions(endpoint.url, 'yearPlan'));
        }
    }

    public formatValue(value: string) {
        return value !== null && value !== undefined && value !== '' ? value : '...';
    }

    public openEditDialog() {
        this.dialog = {opened: true};
        this.editModel = _.cloneDeep(this.yearPlan);
        this.originalModel =  _.cloneDeep(this.yearPlan);
    }

    public onFinishEdit() {
        if (_.isEqual(this.editModel, this.originalModel)) {
            this.dialog = { opened: false };
            return;
        }
        const changes = this.changesToRequest(this.originalModel, this.editModel, this.permissions);
        this.dispatchOnStore(updateYearPlan(this.selectedYear, changes));
    }

    public connectedCallback() {
        super.connectedCallback();

        this.permissionSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.yearPlan'),
            (permissions: IBackendPermissions) => { this.permissions = permissions; });

        this.requestYearPlanSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'yearPlan.requestInProcess'),
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
}

customElements.define(RationaleTab.is, RationaleTab);
