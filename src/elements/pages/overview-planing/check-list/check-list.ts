import {
    loadChecklistCategories,
    loadChecklistCpOutputsConfigs,
    loadChecklistItems, loadChecklistMethodTypes, updateChecklistCpOutputConfig
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

        if (!this.getFromStore('checklist.cpOutputsConfigs')) {
            this.dispatchOnStore(loadChecklistCpOutputsConfigs());
        }

        if (!this.getFromStore('checklist.methodTypes')) {
            this.dispatchOnStore(loadChecklistMethodTypes());
        }

        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'cpOutcomes'], store),
            (cpOutcomes: CpOutcome[]) => { this.cpOutcomes = cpOutcomes || []; });

        this.cpOutputsConfigsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['checklist', 'cpOutputsConfigs'], store),
            (cpOutputsConfigs: CpOutputConfig[]) => {
                this.cpOutputsConfigs = cpOutputsConfigs || [];
                const cpOutcomeId = this.queryParams && this.queryParams.cp_outcome;
                const cpOutputId = this.queryParams && this.queryParams.cp_output;
                this.filteredConfigs = this.getConfigsByCpOutcome(cpOutcomeId);
                this.cpOutputConfig = this.getCpOutputConfigById(cpOutputId);
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

        this.methodsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'methods'], store),
            (methods: Method[] | undefined) => {
                if (!methods) { return; }
                this.methods = methods.filter(method => method.is_types_applicable);
            });

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
        this.selectedModel = R.clone(this.cpOutputConfig);
        this.originalData = R.clone(this.cpOutputConfig);
    }

    public onFinishEditConfig() {
        const changes = this.changes(this.originalData, this.selectedModel, this.permissionsConfigs);
        if (!R.isEmpty(changes)) {
            this.dispatchOnStore(updateChecklistCpOutputConfig(this.selectedModel.id, changes));
        }
        this.dialogEditConfig = { opened: false };
    }

    public selectMethodTypesKIG({ detail }: CustomEvent) {
        const { selectedItems } = detail;
        if  (!selectedItems || !this.selectedModel) { return; }
        this.selectedTypesKIG = selectedItems && selectedItems.map((item: MethodType) => item && item.id) || [];
        this.selectedModel.recommended_method_types = [...this.selectedTypesFG || [], ...this.selectedTypesKIG];
    }

    public selectMethodTypesFG({ detail }: CustomEvent) {
        const { selectedItems } = detail;
        if  (!selectedItems || !this.selectedModel) { return; }
        this.selectedTypesFG = selectedItems && selectedItems.map((item: MethodType) => item && item.id) || [];
        this.selectedModel.recommended_method_types = [...this.selectedTypesKIG || [], ...this.selectedTypesFG];
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

    public changeOutcomeFilter({ detail }: CustomEvent) {
        const { selectedItem } = detail;
        if (selectedItem) {
            this.removeQueryParams('cp_output');
            this.filteredConfigs = this.getConfigsByCpOutcome(selectedItem.id);
            this.updateQueryParams({cp_outcome: selectedItem.id});
        } else {
            this.removeQueryParams('cp_outcome');
        }
        if (this.queryParams.cp_output) {
            this.startLoad();
        }
    }

    public getConfigsByCpOutcome(id: number) {
        return this.cpOutputsConfigs.filter((cpOutputConfig: CpOutputConfig) => cpOutputConfig.cp_output.parent === id);
    }

    public getCpOutputOptions(filteredConfigs: CpOutputConfig[]) {
        return filteredConfigs.map((cpOutputConfig: CpOutputConfig) => ({
            id: cpOutputConfig.cp_output.id,
            name: cpOutputConfig.cp_output.name
        })) || [];
    }

    public changeOutputFilter({ detail }: CustomEvent) {
        const { selectedItem } = detail;
        if (selectedItem) {
            this.updateQueryParams({cp_output: selectedItem.id});
            this.cpOutputConfig = this.getCpOutputConfigById(selectedItem.id);
        } else {
            this.removeQueryParams('cp_output');
            this.cpOutputConfig = null;
        }
        this.startLoad();
    }

    public getCpOutputConfigById(id: number): CpOutputConfig {
        return this.filteredConfigs.find((item: CpOutputConfig) => item.cp_output.id === id);
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
        this.cpOutputsConfigsSubscriber();
        this.checklistCategoriesSubscriber();
        this.checklistItemsSubscriber();
    }

}

customElements.define(CheckList.is, CheckList);
