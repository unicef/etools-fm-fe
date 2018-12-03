import { getEndpoint } from '../../../app-config/app-config';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { loadCpOutputsConfigs } from '../../../redux-store/effects/cp-outputs.effect';
import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';
import { loadSiteLocations } from '../../../redux-store/effects/site-specific-locations.effects';
import {
    loadPartnerTasks,
    loadPlaningTasks,
    removePlaningTask,
    updatePlaningTask
} from '../../../redux-store/effects/plan-by-task.effects';
import { addPlaningTask } from '../../../redux-store/effects/plan-by-task.effects';
import { loadYearPlan } from '../../../redux-store/effects/year-paln.effects';
import { SetPartnerTasks } from '../../../redux-store/actions/plan-by-task.actions';

class PlanByTask extends EtoolsMixinFactory.combineMixins([
    FMMixins.ProcessDataMixin,
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin], Polymer.Element) {

    public static get is() { return 'plan-by-task'; }

    public static get properties() {
        return {
            selectedYear: {
                type: Number,
                observer: 'setYear'
            },
            editedItem: {
                type: Object,
                value: () => ({})
            },
            dialogTexts: {
                type: Object,
                value: {
                    add: {title: 'Add Task', confirm: 'Add', type: 'add', theme: 'default'},
                    edit: {title: 'Edit Task', confirm: 'Save', type: 'edit', theme: 'default'},
                    copy: {title: 'Copy Task', confirm: 'Save', type: 'copy', theme: 'default'},
                    remove: {type: 'remove', theme: 'confirmation', confirm: 'Delete'}
                }
            },
            errors: {
                type: Object,
                value: () => ({})
            },
            planingTasks: {
                type: Array,
                value: () => []
            },
            notTouched: {
                type: Boolean,
                value: false
            },
            interventionsList: {
                type: Array,
                value: () => [],
                computed: 'setInterventionsList(editedItem.partner, selectedOutput)'
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener('add-new', () => this.openDialog({} as EventModel<PlaningTask>));

        this.methodsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.cpOutputsConfigs'),
            (cpOConfigs: CpOutputConfig[] | undefined) => {
                if (!cpOConfigs) { return; }
                this.cpOutputConfigs = cpOConfigs.map(
                    (config: CpOutputConfig) => ({...config, name: config.cp_output.name})
                );
            });

        this.planingTasksSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'planingTasks'),
            (planingTasks: IStatedListData<PlaningTask> | undefined) => {
                if (!planingTasks) { return; }
                this.planingTasks = planingTasks.results || [];
                this.count = planingTasks.count || 0;
            });

        this.partnerTasksSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'planingTasks.partnerTasks'),
            (partnerTasks: {loading: boolean, tasks: PlaningTask[]} | undefined) => {
                if (!partnerTasks) { return; }
                this.partnerTasksLoading = partnerTasks.loading;
                this.partnerTasks = partnerTasks.tasks.filter((task) => task.id !== this.editedItem.id);
            });

        this.permissionsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.planingTasks'),
            (permissions: IPermissionActions | undefined) => {
                this.permissions = permissions;
            });

        this.sitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'specificLocations.results'),
            (sites: Site[] | undefined) => {
                if (!sites) { return; }
                this.locations = _(sites)
                    .groupBy((site: Site) => site.parent.id)
                    .map((groupedSites: Site[]) => {
                        const parent = groupedSites[0].parent;
                        return {...parent, sites: groupedSites};
                    })
                    .sortBy('name')
                    .value();
            });

        this.updateTypeSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'planingTasks.updateInProcess'),
            (updateInProcess: boolean | null) => {
                this.savingInProcess = updateInProcess;
                if (updateInProcess !== false) { return; }

                this.errors = this.getFromStore('planingTasks.errors');
                if (this.errors) { return; }

                if (this.dialog.type === 'add') {
                    this.updateQueryParams({page: 1});
                }
                this.set('dialog.opened', false);
                this.startLoad();
                this.dispatchOnStore(loadYearPlan(this.selectedYear));
            });
    }

    public setYear(year: number) {
        if (year) {
            const endpoint = getEndpoint('planingTasks', {year});
            this.dispatchOnStore(loadPermissions(endpoint.url, 'planingTasks'));
            this.startLoad();
        }
    }

    public getInitQueryParams(): QueryParams {
        return { page: 1, page_size: 10 };
    }

    public initStarLoad() {
        this.dispatchOnStore(new RunGlobalLoading({type: 'planingTaskBaseData', message: 'Loading Data...'}));
        const promises = [this.dispatchOnStore(loadCpOutputsConfigs())];

        if (!this.getFromStore('specificLocations.results')) {
            promises.push(this.dispatchOnStore(loadSiteLocations()));
        }

        Promise.all(promises).then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'planingTaskBaseData'})));
        this.startLoad();
    }

    public finishLoad() {
        this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
            Polymer.Async.timeOut.after(100), () => {
                this.dispatchOnStore(new RunGlobalLoading({type: 'planingTasks', message: 'Loading Data...'}));
                this.dispatchOnStore(loadPlaningTasks(this.selectedYear))
                    .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'planingTasks'})));
            });
    }

    public openDialog({ model, target }: EventModel<PlaningTask>): void {
        const dialogType = _.get(target, 'dataset.type', 'add');
        const count = Array.apply(null, Array(12)).map(() => 0);
        const { item = {plan_by_month: count} } = model || {};
        const texts = this.dialogTexts[dialogType];
        this.editedItem = _.cloneDeep(item);
        this.originalData = _.cloneDeep(item);
        this.dialog = {opened: true, ...texts};
        this._checkNotTouched();
    }

    public resetData(event: CustomEvent): void {
        if (event.target !== this.$.dialog) { return; }
        this.dialog = null;
        this.resetInputs();
        this.editedItem = {};
        this.errors = null;
    }

    public saveTask() {
        if (this.dialog.type === 'copy' && this.notTouched) { return; }
        const equalOrIsDeleteDialog = _.isEqual(this.originalData, this.editedItem) && this.dialog.type !== 'remove';
        if (equalOrIsDeleteDialog) {
            this.set('dialog.opened', false);
            return;
        }
        switch (this.dialog.type) {
            case 'add':
                this.dispatchOnStore(addPlaningTask(this.selectedYear, this.editedItem));
                break;
            case 'edit':
                const changes = this.changesToRequest(this.originalData, this.editedItem, this.permissions);
                this.dispatchOnStore(updatePlaningTask(this.selectedYear, this.editedItem.id, changes));
                break;
            case 'remove':
                this.dispatchOnStore(removePlaningTask(this.selectedYear, this.editedItem.id));
                break;
            case 'copy':
                this.dispatchOnStore(addPlaningTask(this.selectedYear, this.editedItem));
                break;
        }
    }

    public setEditedValue({ detail, target }: CustomEvent) {
        const { selectedItem } = detail;
        const fieldName = (target as HTMLElement).dataset.fieldname;

        if (fieldName) {
            this.set(`editedItem.${fieldName}`, selectedItem && selectedItem.id || null);
        }

        if (fieldName === 'cp_output_config') { this.clearEditedField('partner', 'selectedOutput.partners'); }
        if (fieldName === 'location') { this.clearEditedField('location_site', 'selectedLocation.sites'); }
        if (fieldName === 'partner') { this.clearEditedField('intervention', 'interventionsList'); }

        if (fieldName === 'partner' || fieldName === 'intervention' || fieldName === 'cp_output_config') {
            this.loadPartnerTasks();
        }

        this._checkNotTouched();
    }

    public setInterventionsList(partner: number, output: CpOutputConfig) {
        if (!partner || !output) {
            return [];
        } else {
            const interventions = output.cp_output && output.cp_output.interventions;
            return interventions.filter((intervention: Intervention) => intervention.partner.id === partner);
        }
    }

    public loadPartnerTasks() {
        const type = this.dialog && this.dialog.type;
        const isCopyOrAdd = type !== 'add' && type !== 'copy';

        const partner = !_.isObject(this.editedItem.partner) && this.editedItem.partner;
        const intervention = !_.isObject(this.editedItem.intervention) && this.editedItem.intervention;
        const missingPartnerOrIntervention = !partner || (this.interventionsList.length && !intervention);
        const tasks = this.getFromStore('planingTasks.partnerTasks.tasks');

        if (missingPartnerOrIntervention && !!tasks && !!tasks.length) {
            this.dispatchOnStore(new SetPartnerTasks([]));
            return;
        } else if (missingPartnerOrIntervention || isCopyOrAdd) {
            return;
        }

        if (!this.interventionsList.length) {
            this.dispatchOnStore(loadPartnerTasks(this.selectedYear, { partner }));
        } else {
            this.dispatchOnStore(loadPartnerTasks(this.selectedYear, { partner, intervention }));
        }
    }

    public checkDialogType(currentType: string, ...expectedTypes: string[]): boolean {
        return !!~expectedTypes.indexOf(currentType);
    }

    public isReadonlyField(permissions: PermissionsCollections, field: string, dependency: number) {
        return this.getReadonlyStatus(permissions, field) || !dependency;
    }

    public _checkNotTouched() {
        const isCopyDialog = this.dialog && this.dialog.type === 'copy';
        if (!isCopyDialog) {
            this.notTouched = false;
            return;
        }
        this.notTouched = _.every(this.originalData, (value: any, key: string) => {
            if (_.isArray(value)) { return true; }
            const isObject = _.isObject(value);
            if (isObject) {
                const originalId = +value.id;
                const currentId = +_.get(this, `editedItem.${key}.id`) || +this.editedItem[key];
                return !originalId || originalId === currentId;
            } else {
                return value === this.editedItem[key];
            }
        });

    }

    public pageNumberChanged({detail}: CustomEvent) {
        this.updateQueryParams({page: detail.value});
        this.startLoad();
    }

    public pageSizeSelected({detail}: CustomEvent) {
        this.updateQueryParams({page_size: detail.value});
        this.startLoad();
    }

    public getLocationPart(location: string = '', partToSelect: string) {
        const splittedLocation = location.match(/(.*)\s\[(.*)]/i) || [];
        switch (partToSelect) {
            case 'name':
                return splittedLocation[1];
            case 'code':
                return splittedLocation[2];
            default:
                return location;
        }
    }

    private clearEditedField(field: string, path: string = field) {
        const exists = this.checkExistenceInList(field, path);
        if (!exists) {
            this.set(`editedItem.${field}`, null);
        }
    }

    private checkExistenceInList(field: string, path: string = field) {
        const list = _.get(this, path, []);
        return list.find((item: any) => _.isEqual(this.editedItem[field], item) || item.id === this.editedItem[field]);
    }
}

customElements.define(PlanByTask.is, PlanByTask);