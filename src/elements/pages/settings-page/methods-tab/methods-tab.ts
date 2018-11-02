import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';

class MethodsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.PermissionController,
    FMMixins.ReduxMixin,
    FMMixins.QueryParamsMixin], Polymer.Element) {
    public static get is() { return 'methods-tab'; }

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            methods: {
                type: Array,
                value: () => []
            },
            types: {
                type: Array,
                value: () => []
            },
            queryParams: {
                type: Object,
                observer: '_updateQueries'
            }
        };
    }

    public static get observers() {
        return [
            '_setActive(isActive)'
        ];
    }

    public _setActive(isActive: boolean) {
        if (!isActive) { return; }
        // this._initQueryParams();
    }

    public _updateQueries(): any {
        if (!this.isActive) { return; }
        this.preservedListQueryParams = this.queryParams;
        this.updateQueries(this.queryParams);
    }

    public _changeFilterValue(e: any) {
        const selectedItem = e.detail.selectedItem;
        if (selectedItem) {
            this.set('queryParams', Object.assign({}, this.queryParams, {method: selectedItem.id}));
        }
    }

    public connectedCallback() {
        super.connectedCallback();
        this.methodsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.methods'),
            (methods: Method[] | undefined) => {
                if (!methods) { return; }
                this.methods = methods.filter(method => method.is_types_applicable);
            });

        // test  code
        this.methodsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.methodTypes'),
            (permissions: Method[] | undefined) => {
                console.log(permissions);
                if (permissions) {
                    console.log(this.getDescriptorLabel(permissions, 'method'));
                }
            });
        this.dispatchOnStore(loadPermissions('/api/field-monitoring/settings/methods/types', 'methodTypes'));
        // end test code
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.methodsSubscriber();
    }

}

customElements.define(MethodsTab.is, MethodsTab);
