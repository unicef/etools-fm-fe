import {
    loadChecklistCategories,
    loadChecklistCpOutputs,
    loadChecklistItems, loadChecklistMethodTypes
} from '../../../redux-store/effects/checklist.effects';
import { getEndpoint } from '../../../app-config/app-config';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';

class CheckList extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {

    public static get is() { return 'check-list'; }

    public connectedCallback() {
        super.connectedCallback();

        this.dispatchOnStore(loadChecklistCategories());
        this.dispatchOnStore(loadChecklistItems());
        if (!this.getFromStore('permissions.cpOutputsConfigs')) {
            const endpointConfigs = getEndpoint('cpOutputsConfigs') as StaticEndpoint;
            this.dispatchOnStore(loadPermissions(endpointConfigs.url, 'cpOutputsConfigs'));
        }

        if (!this.getFromStore('checklist.methodTypes')) {
            this.dispatchOnStore(loadChecklistMethodTypes());
        }

        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'cpOutcomes'], store),
            (cpOutcomes: CpOutcome[]) => { this.cpOutcomes = cpOutcomes || []; });

        this.cpOutputSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['checklist', 'cpOutputs'], store),
            (cpOutputs: CpOutputConfig[]) => {
                this.cpOutputsConfigs = cpOutputs || [];
                this.cpOutputsOptions = this.cpOutputsConfigs.map((cpOutput: CpOutputConfig) => ({
                    id: cpOutput.cp_output.id,
                    name: cpOutput.cp_output.name
                })) || [];
            });

        this.checklistCategoriesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['checklist', 'categories'], store),
            (categories: ChecklistCategory[]) => {
                this.categories = categories || [];
                if (categories && categories.length) { this.selectedCategories = [categories[0].id]; }
            });

        this.checklistItemsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['checklist', 'items'], store),
            (items: ChecklistItem[]) => {
                this.checklistItems = items || [];
            });

        this.permissionConfigsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'cpOutputsConfigs'], store),
            (permissions: IBackendPermissions) => { this.permissionsConfigs = permissions; });

        this.typesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['checklist', 'methodTypes'], store),
            (methodTypes: MethodType[]) => {
                this.methodTypesKIG = methodTypes && methodTypes.filter(item => item.method === 1) || [];
                this.methodTypesFG = methodTypes && methodTypes.filter(item => item.method === 2) || [];
            });
    }

    public getMethodTypes(methodTypes: MethodType[], method: number) {
        const filteredMethodTypes = methodTypes.filter(methodType => methodType.method === method);
        return this._simplifyValue(filteredMethodTypes);
    }

    public openEditConfig() {
        this.dialogEditConfig = { opened: true };
    }

    public onFinishEditConfig() {
        this.dialogEditConfig = { opened: false };
    }

    public selectRecommendedMethodTypes({ detail }: CustomEvent) {
        const { selectedItems } = detail;
        console.log(selectedItems);
    }

    public onSelectCategory({model}:  EventModel<ChecklistCategory>) {
        const { item } = model;
        if (!item || !item.id) { return; }
        this.selectedCategories = this.selectedCategories || [];
        const categoryIndex = this.selectedCategories.indexOf(item.id);
        if (!~categoryIndex) {
            this.selectedCategories = [...this.selectedCategories, item.id];
            // this.push('selectedCategories', item.id);
        } else if (this.selectedCategories.length > 1) {
            const categories = [...this.selectedCategories];
            categories.splice(categoryIndex, 1);
            this.selectedCategories = categories;
        }
        this.startLoad();
    }

    public getSelectedClass(category: ChecklistCategory, selectedCategories: number[]) {
        return category && category.id && selectedCategories && ~selectedCategories.indexOf(category.id) ?
            'selected' : '';
    }

    public _changeOutcomeFilter({ detail }: CustomEvent) {
        const { selectedItem } = detail;
        if (selectedItem) {
            // this.removeQueryParams('cp_outcome');
            this.dispatchOnStore(loadChecklistCpOutputs(selectedItem.id));
            this.updateQueryParams({cp_outcome: selectedItem.id});
        } else {
            this.removeQueryParams('cp_outcome');
        }
        if (this.queryParams.cp_output) {
            this.startLoad();
        }
    }

    public _changeOutputFilter({ detail }: CustomEvent) {
        const { selectedItem } = detail;
        if (selectedItem) {
            this.updateQueryParams({cp_output: selectedItem.id});
            this.cpOutputConfig = this.cpOutputsConfigs.find((item: CpOutputConfig) => {
                return item.cp_output.id === selectedItem.id;
            });
        } else {
            this.removeQueryParams('cp_output');
            this.cpOutputConfig = null;
        }
        this.startLoad();
    }

    public finishLoad() {
        // only when route is initialized
        if (!this.queryParams) { return; }
        if (this.checklistItems) {
            this.filteredChecklistItems = this.checklistItems.filter((item: ChecklistItem) => {
                return ~this.selectedCategories.indexOf(item.category);
            });
        }
        // this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
        //     Polymer.Async.timeOut.after(100), () => {
        //     });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.cpOutcomeSubscriber();
        this.cpOutputSubscriber();
        this.checklistCategoriesSubscriber();
        this.checklistItemsSubscriber();
    }

}

customElements.define(CheckList.is, CheckList);
