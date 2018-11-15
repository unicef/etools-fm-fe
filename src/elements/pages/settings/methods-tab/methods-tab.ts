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

    public _changeFilterValue({ detail }: CustomEvent) {
        const selectedItem = detail.selectedItem;
        if (selectedItem) {
            this.updateQueryParams({method: selectedItem.id, page: 1});
        } else {
            this.removeQueryParams('method');
            this.updateQueryParams({page: 1});
        }
        this.startLoad();
    }

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener('sort-changed', this.sort);
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
                this.startLoad();
            });
    }

    public disconnectedCallback() {
        this.removeEventListener('sort-changed', this.sort);
        super.disconnectedCallback();
        this.methodsSubscriber();
        this.typesSubscriber();
        this.this.permissionsSubscriber();
    }

    public sort({ detail }: CustomEvent) {
        const { field, direction } = detail;
        this.updateQueryParams({ordering: `${direction === 'desc' ? '-' : ''}${field}`});
        this.startLoad();
    }

    public openDialog({ model, target }: EventModel<MethodType>): void {
        const dialogType = _.get(target, 'dataset.type');
        if (!dialogType) { return; }

        const { item = {} } = model || {};
        const texts = this.dialogTexts[dialogType];
        this.editedItem = {...item};
        this.originalData = {...item};
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

    public _pageNumberChanged({detail}: CustomEvent) {
        this.updateQueryParams({page: detail.value});
        this.startLoad();
    }

    public _pageSizeSelected({detail}: CustomEvent) {
        this.updateQueryParams({page_size: detail.value});
        this.startLoad();
    }
}

customElements.define(MethodsTab.is, MethodsTab);
