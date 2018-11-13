import {
    addMethodType,
    loadMethodTypes, removeMethodType,
    updateMethodType
} from '../../../redux-store/effects/settings-method-types.effect';
import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';

class MethodsTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin,
    EtoolsAjaxRequestMixin], Polymer.Element) {
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

    public getInitQueryParams(): QueryParams {
        return { page: 1, page_size: 10 };
    }

    public finishLoad() {
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
            this.updateQueryParams({method: selectedItem.id});
            this.finishLoad();
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

        this.updateTypeSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'methodTypes.updateInProcess'),
            (updateInProcess: boolean | null) => {
                this.savingInProcess = updateInProcess;
                if (updateInProcess !== false) { return; }

                this.errors = this.getFromStore('methodTypes.errors');
                if (this.errors) { return; }

                if (this.dialog.type === 'add') {
                    this.updateQueryParams({page: 1});
                }
                this.set('dialog.opened', false);
                this.finishLoad();
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
        const equalOrIsDeleteDialog = _.isEqual(this.originalData, this.editedItem) && this.dialog.type !== 'remove';
        if (equalOrIsDeleteDialog) {
            this.set('dialog.opened', false);
            return;
        }

        switch (this.dialog.type) {
            case 'add':
                this.dispatchOnStore(addMethodType(this.editedItem));
                break;
            case 'edit':
                const changes = this.changesToRequest(this.originalData, this.editedItem, this.permissions);
                this.dispatchOnStore(updateMethodType(this.editedItem.id, changes));
                break;
            case 'remove':
                this.dispatchOnStore(removeMethodType(this.editedItem.id));
                break;
        }
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
        this.errors = null;
    }

    public isRemoveDialog(theme: string): boolean {
        return theme === 'confirmation';
    }
}

customElements.define(MethodsTab.is, MethodsTab);
