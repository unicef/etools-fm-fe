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
        return {
            page: 1,
            page_size: 10,
            parent__in: []
        };
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
        const { selectedItems } = detail;
        if (selectedItems) {
            const values = selectedItems.map((item: CpOutcome) => item.id);
            this.updateQueryParams({parent__in: values});
        } else {
            this.updateQueryParams({page: 1, parent__in: []});
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
            (store: FMStore) => R.path(['cpOutputs'], store),
            (cpOutputs: IListData<CpOutput>) => {
                this.cpOutputs = cpOutputs.results || [];
                this.count = cpOutputs.count;
            });

        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'governmentPartners'], store),
            (partners: Partner[]) => { this.governmentPartners = partners || []; });

        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'cpOutcomes'], store),
            (cpOutcomes: CpOutcome[]) => { this.cpOutcomes = cpOutcomes || []; });

        this.permissionListSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'cpOutputs'], store),
            (permissions: IBackendPermissions) => { this.permissions = permissions; });

        this.permissionDetailsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'cpOutputDetails'], store),
            (permissions: IBackendPermissions) => { this.permissionsDetails = permissions; });

        this.permissionConfigsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'cpOutputsConfigs'], store),
            (permissions: IBackendPermissions) => { this.permissionsConfigs = permissions; });

        this.requestCpOutputSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['cpOutputs', 'requestInProcess'], store),
            (requestInProcess: boolean | null) => {
                this.requestInProcess = requestInProcess;
                if (requestInProcess !== false) { return; }

                this.errors = this.getFromStore('cpOutputs.errors');
                if (this.errors) { return; }

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

        // init
        if (!item.fm_config) { item.fm_config = {} as FmConfig; }
        this.originalData =  R.clone(item);
        if (item.fm_config.government_partners === undefined) { item.fm_config.government_partners = []; }
        if (item.fm_config.is_monitored === undefined) { item.fm_config.is_monitored = false; }
        this.selectedModel = R.clone(item);

        const endpoint = getEndpoint('cpOutputDetails', {id: item.id}) as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'cpOutputDetails'));
    }

    public _selectedEditItemPartners({ detail }: CustomEvent) {
        if (!this.selectedModel || !this.selectedModel.fm_config) { return; }
        const { selectedItems } = detail;
        this.selectedModel.fm_config.government_partners = selectedItems;
    }

    public _openPartners({ model }: EventModel<CpOutput>) {
        const { item } = model;
        this.partners = item.fm_config && item.fm_config.government_partners;
        const dialogTitle = this.getDescriptorLabel(this.permissions, 'fm_config.government_partners');
        this.dialogPartners = {title: dialogTitle, opened: true};
    }

    public _openInterventions({ model }: EventModel<CpOutput>) {
        const { item } = model;
        this.partners = item.interventions ? item.interventions.map((intervention => {
            return {...intervention.partner, ...{number: intervention.number, url: intervention.url}};
        })) : [];
        const dialogTitle = this.getDescriptorLabel(this.permissions, 'interventions');
        this.dialogPartners = {title: dialogTitle, opened: true};
    }

    public isAllowEdit(): boolean {
        return this.permissionsConfigs && this.permissionsConfigs.POST;
    }

    public onFinishEdit() {
        if (R.equals(this.selectedModel, this.originalData)) {
            this.dialog = { opened: false };
            return;
        }
        const changes = this.changesToRequest(this.originalData, this.selectedModel, this.permissionsDetails);
        this.dispatchOnStore(updateCpOutput(this.selectedModel.id, changes));
    }
}

customElements.define(CpOutputsTab.is, CpOutputsTab);
