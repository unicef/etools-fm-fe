import { loadCpOutputs, updateCpOutput } from '../../../redux-store/effects/cp-outputs.effect';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getEndpoint } from '../../../app-config/app-config';

class CpOutputsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {
    public static get is() {
        return 'cp-outputs-tab';
    }

    public static get properties() {
        return {
            count: Number
        };
    }

    public getInitQueryParams(): QueryParams {
        return { page: 1, page_size: 10 };
    }

    public finishLoad() {
        // only when route is initialized
        if (!this.queryParams) { return; }
        this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
            Polymer.Async.timeOut.after(100), () => {
                this.dispatchOnStore(loadCpOutputs(this.queryParams));
            });
    }

    public _changeExpired({ detail }: CustomEvent) {
        const checked = detail.value;
        if (!checked) {
            this.updateQueryParams({is_active: !checked});
        } else {
            this.removeQueryParams('is_active');
        }
        this.updateQueryParams({page: 1});
        this.startLoad();
    }

    public _changeIsMonitored({ detail }: CustomEvent) {
        const checked = detail.value;
        if (checked) {
            this.updateQueryParams({fm_config__is_monitored: checked});
        } else {
            this.removeQueryParams('fm_config__is_monitored');
        }
        this.updateQueryParams({page: 1});
        this.startLoad();
    }

    public _changeOutcomeFilter({ detail }: CustomEvent) {
        const selectedItem = detail.selectedItem;
        if (selectedItem) {
            this.updateQueryParams({parent: selectedItem.id});
        } else {
            this.removeQueryParams('parent');
            this.updateQueryParams({page: 1});
        }
        this.startLoad();
    }

    public _pageNumberChanged({detail}: CustomEvent) {
        this.updateQueryParams({page: detail.value});
        this.startLoad();
    }

    public _pageSizeSelected({detail}: CustomEvent) {
        this.updateQueryParams({page_size: detail.value});
        this.startLoad();
    }

    public connectedCallback() {
        super.connectedCallback();
        const endpoint = getEndpoint('cpOutputs') as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'cpOutputs'));
        const endpointConfigs = getEndpoint('cpOutputsConfigs') as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpointConfigs.url, 'cpOutputsConfigs'));

        this.cpOutputsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'cpOutputs'),
            (cpOutputs: IListData<CpOutput>) => {
                this.cpOutputs = cpOutputs.results || [];
                this.count = cpOutputs.count;
            });

        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.governmentPartners'),
            (partners: Partner[]) => { this.governmentPartners = partners || []; });

        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.cpOutcomes'),
            (cpOutcomes: CpOutcome[]) => { this.cpOutcomes = cpOutcomes || []; });

        this.permissionListSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.cpOutputs'),
            (permissions: IBackendPermissions) => { this.permissions = permissions; });

        this.permissionDetailsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.cpOutputDetails'),
            (permissions: IBackendPermissions) => { this.permissionsDetails = permissions; });

        this.permissionConfigsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.cpOutputsConfigs'),
            (permissions: IBackendPermissions) => { this.permissionsConfigs = permissions; });

        this.requestCpOutputSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'cpOutputs.requestInProcess'),
            (requestInProcess: boolean | null) => {
                this.requestInProcess = requestInProcess;
                if (requestInProcess !== false) { return; }

                this.errors = this.getFromStore('cpOutputs.errors');
                if (this.errors) { return; }

                this.updateQueryParams({page: 1});
                this.dialog = {opened: false};
                this.startLoad();
            });
    }

    public _isOnePartner(items: any[]): boolean {
        return items && items.length === 1;
    }

    public _isManyPartners(items: any[]): boolean {
        return items && items.length > 1;
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.cpOutputsSubscriber();
        this.cpOutcomeSubscriber();
        this.permissionListSubscriber();
        this.permissionDetailsSubscriber();
        this.permissionConfigsSubscriber();
        this.requestCpOutputSubscriber();
    }

    public _openDialog({ model }: EventModel<CpOutput>) {
        const { item } = model;
        this.dialog = { opened: true, confirm: 'Save', title: item.name };

        // init drop-down
        if (!item.fm_config) {
            item.fm_config = { government_partners: [] } as FmConfig;
        }

        this.editModel = _.cloneDeep(item);
        this.originalModel =  _.cloneDeep(item);
        const endpoint = getEndpoint('cpOutputDetails', {id: item.id}) as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'cpOutputDetails'));
    }

    public _selectedEditItemPartners({ detail }: CustomEvent) {
        if (!this.editModel || !this.editModel.fm_config) { return; }
        const { selectedItems } = detail;
        this.editModel.fm_config.government_partners = selectedItems;
    }

    public _openPartners({ model }: EventModel<CpOutput>) {
        const { item } = model;
        this.partners = item.fm_config && item.fm_config.government_partners;
        const dialogTitle = this.getDescriptorLabel(this.permissions, 'fm_config.government_partners');
        this.dialogPartners = {title: dialogTitle, opened: true};
    }

    public _openInterventions({ model }: EventModel<CpOutput>) {
        const { item } = model;
        this.partners = item.interventions ? item.interventions.map((intervention => intervention.partner)) : [];
        const dialogTitle = this.getDescriptorLabel(this.permissions, 'interventions');
        this.dialogPartners = {title: dialogTitle, opened: true};
    }

    public isAllowEdit(): boolean {
        return this.permissionsConfigs && this.permissionsConfigs.POST;
    }

    public onFinishEdit() {
        if (_.isEqual(this.editModel, this.originalModel)) {
            this.dialog = { opened: false };
            return;
        }
        const changes = this.changesToRequest(this.originalModel, this.editModel, this.permissionsDetails);
        this.dispatchOnStore(updateCpOutput(this.editModel.id, changes));
    }
}

customElements.define(CpOutputsTab.is, CpOutputsTab);
