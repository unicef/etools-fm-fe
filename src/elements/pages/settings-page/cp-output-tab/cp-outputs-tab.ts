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
            queryParams: {
                type: Object,
                observer: '_updateQueries',
                notify: true
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
            '_setPath(path)'
        ];
    }

    public _setPath(path: string) {
        if (!~path.indexOf('cp-outputs')) { return; }
        this.clearQueries();
        this._initQueryParams();
        this.updateQueries(this.componentQueryParams);
    }

    public _updateQueries(): any {
        if (!~this.path.indexOf('cp-outputs')) { return; }
        this.componentQueryParams = this.queryParams;
        this.loadData();
    }

    public loadData() {
        this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
            Polymer.Async.timeOut.after(100), () => {
                this.dispatchOnStore(loadCpOutputs(this.componentQueryParams));
            });
    }

    public _changeFilterValue(e: any) {
        const selectedItem = e.detail.selectedItem;
        if (selectedItem) {
            this.set('queryParams.cp_outcome', selectedItem.id);
        }
    }

    public _pageNumberChanged({detail}: any) {
        this.set('queryParams.page', detail.value);
    }

    public _pageSizeSelected({detail}: any) {
        this.set('queryParams.page_size', detail.value);
    }

    public connectedCallback() {
        super.connectedCallback();
        const endpoint = getEndpoint('cpOutputs') as StaticEndpoint;
        this.dispatchOnStore(loadPermissions(endpoint.url, 'cpOutputs'));
        this.cpOutputsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'cpOutputs'),
            (cpOutputs: ListData) => {
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

    private _initQueryParams() {
        if (!_.get(this.componentQueryParams, 'page')) {
            this.set('componentQueryParams.page', this.pageNumber);
        }
        if (!_.get(this.componentQueryParams, 'page_size')) {
            this.set('componentQueryParams.page_size', this.pageSize);
        }
    }
}

customElements.define(CpOutputsTab.is, CpOutputsTab);
