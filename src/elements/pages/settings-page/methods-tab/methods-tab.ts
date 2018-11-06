import { loadMethodTypes } from '../../../redux-store/effects/settings-method-types.effects';
import { getEndpoint } from '../../../app-config/app-config';
import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';

class MethodsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.QueryParamsMixin,
    EtoolsAjaxRequestMixin], Polymer.Element) {
    public static get is() { return 'methods-tab'; }

    public static get properties() {
        return {
            route: {
                type: Object,
                notify: true
            },
            isActive: Boolean,
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
            editedItem: {
                type: Object,
                value: () => ({})
            },
            dialogTexts: {
                type: Object,
                value: {
                    add: {title: 'Add Method Type', confirm: 'Add', type: 'add', theme: 'default'},
                    edit: {title: 'Edit Method Type', confirm: 'Save', type: 'edit', theme: 'default'},
                    remove: {type: 'remove', theme: 'confirmation'}
                }
            }
        };
    }

    public static get observers() {
        return [
            '_setActive(isActive)'
        ];
    }

    public _setActive(isActive: boolean): void {
        if (!isActive) { return; }
        this.initBaseListQueries(this.preservedListQueryParams);
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
                this.dispatchOnStore(new RunGlobalLoading({type: 'methodTypes', message: 'Loading Data...'}));
                this.dispatchOnStore(loadMethodTypes(this.queryParams))
                    .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'methodTypes'})));
            });
    }

    public _changeFilterValue(event: CustomEvent) {
        const selectedItem = event.detail.selectedItem;
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
        this.typesSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'methodTypes'),
            (types: IStatedListData<MethodType> | undefined) => {
                if (!types) { return; }
                this.types = types.results || [];
                this.count = types.count || 0;
            });
        this.permissionsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.methodTypes'),
            (permissions: IPermissionActions | undefined) => {
                this.permissions = permissions;
            });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.methodsSubscriber();
        this.typesSubscriber();
        this.this.permissionsSubscriber();
    }

    public openDialog(event: MouseEvent): void {
        const icon = event.target;
        const dialogType = _.get(icon, 'dataset.type');
        if (!dialogType) { return; }

        const model = _.get(event, 'model.item', {});
        const texts = this.dialogTexts[dialogType];
        this.editedItem = {...model};
        this.originalData = {...model};
        this.dialog = {opened: true, ...texts};
    }

    public saveType() {
        const id = this.editedItem.id;
        let method;
        let endpoint;

        switch (this.dialog.type) {
            case 'add':
                method = 'POST';
                endpoint = getEndpoint('methodTypes');
                break;
            case 'edit':
                method = 'PATCH';
                endpoint = getEndpoint('methodTypeDetails', {id});
                break;
            case 'remove':
                method = 'DELETE';
                endpoint = getEndpoint('methodTypeDetails', {id});
                this.editedItem.delete = true;
                break;
        }

        if (_.isEqual(this.originalData, this.editedItem)) {
            this.set('dialog.opened', false);
            return;
        }

        this.savingInProcess = true;
        this
            .sendRequest({endpoint, method, body: this.editedItem})
            .then(() => {
                if (this.dialog.type === 'add') {
                    this.set('queryParams', {page: 1, page_size: this.queryParams.page_size});
                }
                this.set('dialog.opened', false);
                this.loadData();
            })
            .finally(() => this.savingInProcess = false);
    }

    public getMethodName(methodId: number): string {
        const methodObj = this.methods.find((method: Method) => method.id === methodId);
        return methodObj.name;
    }

    public isDropdownReadonly(permissions: IPermissionActions): boolean {
        return !!this.editedItem.id || !!(permissions && this.getReadonlyStatus(permissions, 'method'));
    }

    public resetData(event: CustomEvent): void {
        if (event.target !== this.$.dialog) { return; }
        this.dialog = null;
        this.resetInputs();
        this.editedItem = {};
    }

    public isRemoveDialog(theme: string): boolean {
        return theme === 'confirmation';
    }

}

customElements.define(MethodsTab.is, MethodsTab);
