class MethodsTab extends FMMixins.ReduxMixin(Polymer.Element) {
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
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.methodsSubscriber();
    }

}

customElements.define(MethodsTab.is, MethodsTab);
