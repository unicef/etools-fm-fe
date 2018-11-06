import { loadCpOutputs } from '../../../redux-store/effects/load-cp-outputs.effect';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getEndpoint } from '../../../app-config/app-config';

class CpOutputsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.PermissionController,
    FMMixins.ReduxMixin,
    FMMixins.QueryParamsMixin], Polymer.Element) {
    public static get is() {
        return 'cp-outputs-tab';
    }

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            isActive: {
                type: Boolean
            },
            dialogHeader: {
                type: String
            },
            isOpenedCpOutput: {
                type: Boolean
            },
            queryParams: {
                type: Object,
                observer: '_updateQueries'
            },
            pageNumber: {
                type: Number,
                value: 1
            },
            pageSize: {
                type: Number,
                value: 10
            },
            count: Number,
        };
    }

    public static get observers() {
        return [
            '_setActive(isActive)'
        ];
    }

    public _setActive(isActive: boolean) {
        if (!isActive) { return; }
        this._initQueryParams();
    }

    public _updateQueries(): void {
        if (!this.isActive) { return; }
        this.preservedListQueryParams = this.queryParams;
        this.updateQueries(this.queryParams);
        this.loadData();
    }

    public loadData() {
        this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
            Polymer.Async.timeOut.after(100), () => {
                this.dispatchOnStore(loadCpOutputs(this.queryParams));
            });
    }

    public _changeFilterValue(e: CustomEvent) {
        const selectedItem = e.detail.selectedItem;
        if (selectedItem) {
            this.set('queryParams', Object.assign({}, this.queryParams, {cp_outcome: selectedItem.id}));
        }
    }

    public _pageNumberChanged({detail}: any) {
        this.set('queryParams', Object.assign({}, this.queryParams, {page: detail.value}));
    }

    public _pageSizeSelected({detail}: any) {
        this.set('queryParams', Object.assign({}, this.queryParams, {page_size: detail.value}));
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

    private _initQueryParams() {
        const pageNumber = _.get(this.preservedListQueryParams, 'page', this.pageNumber);
        const pageSize = _.get(this.preservedListQueryParams, 'page_size', this.pageSize);
        this.set('queryParams', {
            page: pageNumber,
            page_size: pageSize
        });
    }
}

customElements.define(CpOutputsTab.is, CpOutputsTab);
