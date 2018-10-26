import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';

class MethodsTab extends FMMixins.PermissionController(FMMixins.ReduxMixin(Polymer.Element)) {
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
            }
        };
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
