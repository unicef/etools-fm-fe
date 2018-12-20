import {
    loadChecklistCpOutputsConfigs,
    loadChecklistMethodTypes,
    loadPlanedChecklist,
    updateChecklistCpOutputConfig, updateChecklistPlaned
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

        if (!this.getFromStore('permissions.cpOutputsConfigs')) {
            const endpointConfigs = getEndpoint('cpOutputsConfigs');
            this.dispatchOnStore(loadPermissions(endpointConfigs.url, 'cpOutputsConfigs'));
        }

        if (!this.getFromStore('checklist.cpOutputsConfigs')) {
            this.dispatchOnStore(loadChecklistCpOutputsConfigs());
        }

        if (!this.getFromStore('checklist.methodTypes')) {
            this.dispatchOnStore(loadChecklistMethodTypes());
        }

        this.planedItemsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['checklist', 'planedItems'], store),
            (planedItems: ChecklistPlanedItem[]) => {
                this.planedItems = planedItems || [];
            });

        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'cpOutcomes'], store),
            (cpOutcomes: CpOutcome[]) => { this.cpOutcomes = cpOutcomes || []; });

        this.cpOutputsConfigsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['checklist', 'cpOutputsConfigs'], store),
            (cpOutputsConfigs: CpOutputConfig[]) => {
                this.cpOutputsConfigs = cpOutputsConfigs || [];
                const cpOutcomeId = this.queryParams && this.queryParams.cp_outcome;
                const cpOutputId = this.queryParams && this.queryParams.cp_output;
                this.filteredConfigs = this.getConfigsByOutcome(cpOutcomeId, this.cpOutputsConfigs);
                this.cpOutputConfig = this.getConfigById(cpOutputId, this.filteredConfigs);
                this.changeOutputConfig(this.cpOutputConfig);

                this.startLoad();
            });

        this.checklistCategoriesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'checklistCategories'], store),
            (categories: ChecklistCategory[]) => {
                this.categories = categories || [];
                if (categories && categories.length) { this.selectedCategories = [categories[0].id]; }
            });

        this.checklistItemsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'checklistItems'], store),
            (items: ChecklistItem[]) => {
                this.checklistItems = items || [];
            });

        this.permissionConfigsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'cpOutputsConfigs'], store),
            (permissions: IBackendPermissions) => { this.permissionsConfigs = permissions; });

        this.permissionConfigsItemsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'checklistPlaned'], store),
            (permissions: IBackendPermissions) => { this.permissionsConfigsItems = permissions; });

        this.methodsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'methods'], store),
            (methods: Method[] | undefined) => {
                if (!methods) { return; }
                this.allMethods = methods;
                this.methods = methods.filter(method => method.is_types_applicable);
            });

        this.typesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['checklist', 'methodTypes'], store),
            (methodTypes: MethodType[]) => {
                this.methodTypesKIG = methodTypes && methodTypes.filter(item => item.method === 1) || [];
                this.methodTypesFG = methodTypes && methodTypes.filter(item => item.method === 2) || [];
            });

        this.requestSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['checklist', 'requestInProcess'], store),
            (requestInProcess: boolean | null) => {
                this.requestInProcess = requestInProcess;
            });
    }

    public getTypesOfMethodsString(methodTypes: MethodType[], method: number) {
        return methodTypes
            .filter(methodType => methodType.method === method)
            .map((methodType: MethodType) => (methodType.name))
            .join(', ');
    }

    public getMethodTypes(methodTypes: MethodType[], method: number) {
        const filteredMethodTypes = methodTypes.filter(methodType => methodType.method === method);
        return this._simplifyValue(filteredMethodTypes);
    }

    public isSelectedChecklistMethod(planed: ChecklistPlanedItem[], planedId: number, methodId: number) {
        if (!planed) { return false; }
        const checklistPlaned = planed.find((item: ChecklistPlanedItem) => item.checklist_item === planedId);
        return checklistPlaned && this.isSelectedPlanedMethod(checklistPlaned, methodId);
    }

    public getPartnerInfoNumber(index: number) { return ++index; }

    public openChecklistItem({ model }: EventModel<ChecklistItem>) {
        const { item } = model;
        const title = `${item.question_number}) ${item.question_text}`;
        const planedItem = this.planedItems.find((pi: ChecklistPlanedItem) => pi.checklist_item === item.id);
        const editItem = planedItem || {
            checklist_item:
            item.id, methods: [],
            partners_info: [{partner: null, standard_url: ''}]
        };
        this.dialogItem =  {opened: true, title, isNew: !planedItem};
        this.originalPlanedItem = R.clone(editItem);
        this.selectedPlanedItem = R.clone(editItem);
        const partnersInfo = R.clone(this.selectedPlanedItem.partners_info);
        this.typePartnersInfo = this.getTyperPartnersInfo(partnersInfo);
        this.partnersInfo = this.getPartnersInfo(this.typePartnersInfo, partnersInfo);
    }

    public onFinishItem() {
        let allChanges: any = {};
        const allPartnersChanges =
            this.getPartnersChanges(this.selectedPlanedItem, this.partnersInfo, this.permissionsConfigsItems);
        const planedItemChanges =
            this.changes(this.originalPlanedItem, this.selectedPlanedItem, this.permissionsConfigsItems);

        if (this.dialogItem.isNew) {
            if (!R.isEmpty(planedItemChanges) || !R.isEmpty(allPartnersChanges)) {
                allChanges = {...this.selectedPlanedItem, ...{partners_info: this.partnersInfo}};
            }
        } else {
            if (!R.isEmpty(planedItemChanges)) {allChanges = {...planedItemChanges}; }
            if (!R.isEmpty(allPartnersChanges)) {allChanges = {...allChanges, ...{partners_info: allPartnersChanges}}; }
        }
        const checklistItemId = this.selectedPlanedItem.checklist_item;
        const configId = this.cpOutputConfig.id;
        if (!R.isEmpty(allChanges)) {
            this.dispatchOnStore(updateChecklistPlaned(checklistItemId, configId, allChanges));
            this.selectedPlanedItem = null;
            this.originalPlanedItem = null;
        }
        this.dialogItem = {opened: false};
    }

    public getPartnersChanges(selectedPlanedItem: ChecklistPlanedItem, partnersInfo: PartnerInfo[],
                              permissions: IBackendPermissions) {
        let allPartnersChanges = [];
        const oldData = R.clone(selectedPlanedItem.partners_info);
        const oldTypePartners = this.getTyperPartnersInfo(selectedPlanedItem.partners_info);
        const newTypePartners = this.getTyperPartnersInfo(partnersInfo);
        if (newTypePartners !== oldTypePartners) {
            const deletedPartners = oldData
                .filter((pi: PartnerInfo) => pi.id)
                .map((pi: PartnerInfo) => ({ id: pi.id, _delete: true}));
            allPartnersChanges = [...deletedPartners];
        }
        const partnersChangesObj = this.changes(oldData, partnersInfo, permissions, true, 'partners_info.child');
        const partnersInfoChanges = Object.keys(partnersChangesObj).map(change => partnersChangesObj[change]);
        return [...allPartnersChanges, ...partnersInfoChanges].map((partnerInfo) => {
            if (partnerInfo && partnerInfo.partner && partnerInfo.partner.id) {
                partnerInfo.partner = partnerInfo.partner.id;
            }
            return partnerInfo;
        });
    }

    public getTyperPartnersInfo(partnersInfo: PartnerInfo[]) {
        return partnersInfo.some((pi: PartnerInfo) => !pi.partner) ? 'all' : 'each';
    }

    public isPartnersInfoType(planed: ChecklistPlanedItem[], planedId: number, type: string) {
        if (!planed) { return; }
        const checklistPlaned = planed.find((item: ChecklistPlanedItem) => item.checklist_item === planedId);
        if (!checklistPlaned) { return; }
        const partnersInfo = checklistPlaned.partners_info;
        const partnerInfoType = partnersInfo.some((info: PartnerInfo) => !info.partner) ? 'all' : 'each';
        return partnerInfoType === type;
    }

    public changeTypeInfo({ detail }: CustomEvent) {
        const {value} = detail;
        const partnersInfo = this.selectedPlanedItem.partners_info;
        this.partnersInfo = this.getPartnersInfo(value, partnersInfo);
    }

    public getAllPartnersDetailsColumn(planed: ChecklistPlanedItem[], planedId: number) {
        const planedItem = planed.find((item: ChecklistPlanedItem) => item.checklist_item === planedId);
        return planedItem && planedItem.partners_info.length && planedItem.partners_info[0].specific_details;
    }

    public getAllPartnersUlrColumn(planed: ChecklistPlanedItem[], planedId: number) {
        const planedItem = planed.find((item: ChecklistPlanedItem) => item.checklist_item === planedId);
        return planedItem && planedItem.partners_info.length && planedItem.partners_info[0].standard_url;
    }

    public getPartnersInfo(type: string, partnersInfo: PartnerInfo[]) {
        const isAllPartnersInfo = partnersInfo.some((info: PartnerInfo) => !info.partner);
        if (type === 'all' && !isAllPartnersInfo) { return [{partner: null}]; }
        if (type === 'each' && isAllPartnersInfo) { return this.createPartnersInfoFromPartners(this.partners); }
        return partnersInfo;
    }

    public createPartnersInfoFromPartners(partners: Partner[]) {
        return partners.map((p: Partner) => ({partner: p}));
    }

    public isPartnerInfoType(selectedType: string, type: string) {
        return selectedType === type;
    }

    public isSelectedPlanedMethod(checklistPlaned: ChecklistPlanedItem, methodId: number) {
        return checklistPlaned && ~checklistPlaned.methods.indexOf(methodId);
    }

    public selectChecklistMethod(e: any) {
        if (!e || !e.target || !e.model || !e.model.item) { return; }
        const methodId = e.model.item.id;
        const methods = [...this.selectedPlanedItem.methods];
        if (e.target.checked) {
            this.selectedPlanedItem.methods = [...methods, methodId];
        } else {
            const indexMethod = methods.indexOf(methodId);
            if (~indexMethod) {
                methods.splice(indexMethod, 1);
                this.selectedPlanedItem.methods = [...methods];
            }
        }
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

    public goToSettings() {
        this.dialogEditConfig = {opened: false};
        history.pushState({}, '', '/fm/settings/methods');
        window.dispatchEvent(new CustomEvent('location-changed'));
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
            this.filteredConfigs = this.getConfigsByOutcome(selectedItem.id, this.cpOutputsConfigs);
            this.updateQueryParams({cp_outcome: selectedItem.id});
        } else {
            this.removeQueryParams('cp_outcome');
        }
        if (this.queryParams.cp_output) {
            this.startLoad();
        }
    }

    public getConfigsByOutcome(id: number, configs: CpOutputConfig[]): CpOutputConfig[] {
        return configs && configs
            .filter((config: CpOutputConfig) => config.cp_output.parent === id && config.is_monitored) || [];
    }

    public getOutputOptions(filteredConfigs: CpOutputConfig[]) {
        return filteredConfigs
            .map((cpOutputConfig: CpOutputConfig) => ({
                id: cpOutputConfig.cp_output.id,
                name: cpOutputConfig.cp_output.name}))
            .sort((a, b) => {
                if (a.name < b.name) { return -1; }
                if (a.name > b.name) { return 1; }
                return 0;
            }) || [];
    }

    public changeOutputFilter({ detail }: CustomEvent) {
        const { selectedItem } = detail;
        if (selectedItem) {
            this.updateQueryParams({cp_output: selectedItem.id});
            this.cpOutputConfig = this.getConfigById(selectedItem.id, this.filteredConfigs);
            this.changeOutputConfig(this.cpOutputConfig);
        } else {
            this.removeQueryParams('cp_output');
            this.cpOutputConfig = null;
            this.partners = [];
        }
        this.startLoad();
    }

    public changeOutputConfig(cpOutputConfig: CpOutputConfig) {
        if (!cpOutputConfig) { return; }
        const configPartners = cpOutputConfig.partners;
        this.partners = configPartners && configPartners.map((partner: Partner) => {
            return {id: partner.id, name: partner.name};
        });
        const endpointConfigs = getEndpoint('checklistPlaned', {config_id: cpOutputConfig.id});
        this.dispatchOnStore(loadPermissions(endpointConfigs.url, 'checklistPlaned'));
        this.dispatchOnStore(loadPlanedChecklist(cpOutputConfig.id));
    }

    public getConfigById(id: number, configs: CpOutputConfig[]): CpOutputConfig | undefined {
        return configs && configs.find((item: CpOutputConfig) => item.cp_output.id === id);
    }

    public finishLoad() {
        // only when route is initialized
        if (!this.queryParams) { return; }
        if (this.checklistItems) {
            this.filteredChecklistItems = this.checklistItems.filter((item: ChecklistItem) => {
                return ~this.selectedCategories.indexOf(item.category);
            });
        }
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.planedItemsSubscriber();
        this.cpOutcomeSubscriber();
        this.cpOutputsConfigsSubscriber();
        this.checklistCategoriesSubscriber();
        this.checklistItemsSubscriber();
        this.permissionConfigsSubscriber();
        this.permissionConfigsItemsSubscriber();
        this.methodsSubscriber();
        this.typesSubscriber();
    }

}

customElements.define(CheckList.is, CheckList);
