import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';

class MethodsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.PermissionController,
    FMMixins.ReduxMixin,
    FMMixins.QueryParamsMixin], Polymer.Element) {
    public static get is() { return 'methods-tab'; }

    public static get properties() {
        return {
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
                observer: '_updateQueries',
                notify: true
            }
        };
    }

    public static get observers() {
        return [
            '_setPath(path)'
        ];
    }

    public _setPath(path: string) {
        if (!~path.indexOf('methods')) { return; }
        this.clearQueries();
        this.updateQueries(this._queryParams, null, true);
    }

    public _updateQueries(): any {
        if (!~this.path.indexOf('methods')) { return; }
        this._queryParams = this.queryParams;
    }

    public _changeFilterValue(e: any) {
        const selectedItem = e.detail.selectedItem;
        if (selectedItem) {
            this.set('queryParams.method', selectedItem.id);
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
