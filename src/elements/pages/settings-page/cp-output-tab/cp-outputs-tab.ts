import { loadCpOutputs } from '../../../redux-store/effects/load-cp-outputs.effect';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getEndpoint } from '../../../app-config/app-config';

class CpOutputsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.PermissionController,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {
    public static get is() {
        return 'cp-outputs-tab';
    }

    public static get properties() {
        return {
            dialogHeader: {
                type: String
            },
            isOpenedCpOutput: {
                type: Boolean
            },
            count: Number
        };
    }

    public getInitQueryParams(): QueryParams {
        return { page: 1, page_size: 10 };
    }

    public finishLoad() {
        this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
            Polymer.Async.timeOut.after(100), () => {
                this.dispatchOnStore(loadCpOutputs(this.queryParams));
            });
    }

    public _changeFilterValue(e: CustomEvent) {
        const selectedItem = e.detail.selectedItem;
        if (selectedItem) {
            this.updateQueryParams({cp_outcome: selectedItem.id});
            this.finishLoad();
        }
    }

    public _pageNumberChanged({detail}: CustomEvent) {
        this.updateQueryParams({page: detail.value});
        this.finishLoad();
    }

    public _pageSizeSelected({detail}: CustomEvent) {
        this.updateQueryParams({page_size: detail.value});
        this.finishLoad();
    }

    public connectedCallback() {
        super.connectedCallback();
        const endpoint = getEndpoint('cpOutputs') as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'cpOutputs'));
        this.cpOutputsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'cpOutputs'),
            (cpOutputs: IListData<SettingsCpOutput>) => {
                this.cpOutputs = cpOutputs.results || [];
                this.count = cpOutputs.count;
            });
        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.cpOutcome'),
            (cpOutcomes: CpOutcome[]) => { this.cpOutcomes = cpOutcomes || []; });
        this.permissionSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.cpOutputs'),
            (permissions: IBackendPermissions) => { this.permissions = permissions; });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.cpOutputsSubscriber();
        this.cpOutcomeSubscriber();
        this.permissionSubscriber();
    }

    public _openDialog() {
        this.isOpenedCpOutput = true;
    }
}

customElements.define(CpOutputsTab.is, CpOutputsTab);
