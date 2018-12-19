import { getEndpoint } from '../../../app-config/app-config';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { loadCpOutputsConfigs } from '../../../redux-store/effects/cp-outputs.effect';
import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';
import { loadSiteLocations } from '../../../redux-store/effects/site-specific-locations.effects';
import {
    loadInterventionLocations,
    loadPartnerTasks,
    loadPlaningTasks,
    removePlaningTask,
    updatePlaningTask
} from '../../../redux-store/effects/plan-by-task.effects';
import { addPlaningTask } from '../../../redux-store/effects/plan-by-task.effects';
import { loadYearPlan } from '../../../redux-store/effects/year-paln.effects';
import { SetInterventionLocations, SetPartnerTasks } from '../../../redux-store/actions/plan-by-task.actions';
import { loadStaticData } from '../../../redux-store/effects/load-static-data.effect';
import { AddNotification } from '../../../redux-store/actions/notification.actions';
import { locationsInvert } from '../../settings/sites-tab/locations-invert';

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
            selectedModel: {
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
            interventionsList: {
                type: Array,
                value: () => [],
                computed: 'setInterventionsList(selectedModel.partner, selectedOutput)'
            },
            enableLocationSelect: {
                type: Boolean,
                computed: 'setEnableLocationSelect(selectedModel.partner, selectedModel.intervention)'
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.addEventListener('add-new', () => this.openDialog({} as EventModel<PlaningTask>));
        this.addEventListener('sort-changed', this.sort);

        this.methodsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'cpOutputsConfigs'], store),
            (cpOConfigs: CpOutputConfig[] | undefined) => {
                if (!cpOConfigs) { return; }
                this.cpOutputConfigs = cpOConfigs.map(
                    (config: CpOutputConfig) => ({...config, name: config.cp_output.name})
                );
            });

        this.tasksCountSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['planingTasks', 'count'], store),
            (count: number | undefined) => this.count = count || 0);

        this.planingTasksSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['planingTasks', 'results'], store),
            (planingTasks: PlaningTask[] | undefined) => this.planingTasks = planingTasks || []);

        this.partnerTasksSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['planingTasks', 'partnerTasks'], store),
            (partnerTasks: {loading: boolean, tasks: PlaningTask[]} | undefined) => {
                if (!partnerTasks) { return; }
                this.partnerTasksLoading = partnerTasks.loading;
                this.partnerTasks = partnerTasks.tasks.filter((task) => task.id !== this.selectedModel.id);
            });

        this.interventionLocationsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['planingTasks', 'locationsList'], store),
            (locations: ISiteParrentLocation[] | undefined) => this.locationsList = locations || []);

        this.permissionsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'planingTasks'], store),
            (permissions: IPermissionActions | undefined) =>  this.permissions = permissions);

        this.sitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['specificLocations', 'results'], store),
            (sites: Site[] | undefined) => {
                if (!sites) { return; }
                this.sitesByParent = locationsInvert(sites); });

        this.locationsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'locations'], store),
            (locations: Location[] | undefined) => {
                if (!locations) { return; }
                this.locations = locations;
            });

        this.updateTypeSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['planingTasks', 'updateInProcess'], store),
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

        this.cpOutcomeSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'cpOutcomes'], store),
            (cpOutcomes: CpOutcome[]) => { this.cpOutcomes = cpOutcomes || []; });

        this.filterLocationsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'tasksFilterLocations'], store),
            (locations: Location[]) => { this.filterLocations = locations || []; });

        this.filterSitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'tasksFilterSites'], store),
            (sites: Site[]) => { this.filterSites = sites || []; });

        this.filterPartnersSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'tasksFilterPartners'], store),
            (partners: Partner[]) => { this.filterPartners = partners || []; });
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.methodsSubscriber();
        this.planingTasksSubscriber();
        this.partnerTasksSubscriber();
        this.permissionsSubscriber();
        this.sitesSubscriber();
        this.updateTypeSubscriber();
        this.cpOutcomeSubscriber();
        this.filterLocationsSubscriber();
        this.filterSitesSubscriber();
        this.filterPartnersSubscriber();
        this.removeEventListener('sort-changed', this.sort);
    }

    public setYear(year: number) {
        if (year && this.isActive) {
            this.updateQueryParams({ year });
        } else if (year && this.queryParams) {
            this.queryParams.year = year;
        }

        if (year) {
            const endpoint = getEndpoint('planingTasks', {year});
            this.dispatchOnStore(loadPermissions(endpoint.url, 'planingTasks'));
            this.dispatchOnStore(loadStaticData('tasksFilterLocations', {year}, true));
            this.dispatchOnStore(loadStaticData('tasksFilterSites', {year}, true));
            this.dispatchOnStore(loadStaticData('tasksFilterPartners', {year}, true));
            this.startLoad();
        }
    }

    public getInitQueryParams(): QueryParams {
        return {
            page: 1, page_size: 10, cp_output_config__cp_output__parent__in: [],
            cp_output_config__in: [], partner__in: [], location__in: [],
            location_site__in: [], year: this.selectedYear
        };
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
                this.dispatchOnStore(loadPlaningTasks(this.selectedYear, this.queryParams))
                    .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'planingTasks'})));
            });
    }

    public reopenDialog(event: EventModel<PlaningTask>): void {
        this.set('dialog.opened', false);
        // @ts-ignore
        this.resetData({target: this.$.dialog});
        this.openDialog(event);
        this.loadPartnerTasks();
    }

    public openDialog({ model, target }: EventModel<PlaningTask>): void {
        const dialogType = R.pathOr('add', ['dataset', 'type'], target);
        const count = Array.apply(null, Array(12)).map(() => 0);
        let { item = ({plan_by_month: count} as PlaningTask) } = model || {};

        if (dialogType === 'copy') {
            item = R.clone(item);
            delete item.id;
            delete item.location;
            delete item.location_site;
            item.plan_by_month = R.map(() => 0, new Array(12));
        }

        const texts = this.dialogTexts[dialogType];
        this.selectedModel = R.clone(item);
        this.originalData = R.clone(item);
        this.dialog = {opened: true, ...texts};
    }

    public resetData(event: CustomEvent): void {
        if (event.target !== this.$.dialog) { return; }
        this.dialog = null;
        this.resetInputs();
        this.selectedModel = {};
        this.errors = null;
    }

    public saveTask() {
        if ((this.dialog.type === 'copy' || this.dialog.type === 'add') && this.validateExisted()) {
            const message = 'Identical task is already planned. Please edit existing object instead.';
            this.dispatchOnStore(new AddNotification(message));
            return;
        }

        const equalOrIsDeleteDialog = R.equals(this.originalData, this.selectedModel) && this.dialog.type !== 'remove';
        if (equalOrIsDeleteDialog) {
            this.set('dialog.opened', false);
            return;
        }

        switch (this.dialog.type) {
            case 'add':
                this.dispatchOnStore(addPlaningTask(this.selectedYear, this.selectedModel));
                break;
            case 'edit':
                const changes = this.changesToRequest(this.originalData, this.selectedModel, this.permissions);
                this.dispatchOnStore(updatePlaningTask(this.selectedYear, this.selectedModel.id, changes));
                break;
            case 'remove':
                this.dispatchOnStore(removePlaningTask(this.selectedYear, this.selectedModel.id));
                break;
            case 'copy':
                this.dispatchOnStore(addPlaningTask(this.selectedYear, this.selectedModel));
                break;
        }
    }

    public validateExisted(): boolean {
        if (!this.partnerTasks.length || !this.selectedModel) { return false; }
        return this.partnerTasks.some((task: PlaningTask) => {
            return ['location', 'location_site', 'intervention', 'partner', 'cp_output'].every(
                // @ts-ignore
                (key: string) => this.selectedModel[key] === (task[key] && task[key].id));
        });
    }

    public setEditedValue({ detail, target }: CustomEvent) {
        const { selectedItem } = detail;
        const fieldName = (target as HTMLElement).dataset.fieldname;

        if (fieldName) {
            this.set(`selectedModel.${fieldName}`, selectedItem && selectedItem.id || null);
        }
        if (fieldName === 'cp_output_config') { this.clearEditedField('partner', 'selectedOutput.partners'); }
        if (fieldName === 'location') {
            this.selectedLocation = !!selectedItem && this.sitesByParent.find(
                (location: ISiteParrentLocation) => location.id === selectedItem.id) || selectedItem;
            this.clearEditedField('location_site', 'selectedLocation.sites');
        }
        if (fieldName === 'partner') { this.clearEditedField('intervention', 'interventionsList'); }
        if (fieldName === 'partner' || fieldName === 'intervention' || fieldName === 'cp_output_config') {
            this.loadPartnerTasks();
            this.loadLocationsList()
                .then(() => this.clearEditedField('location', 'locationsList'))
                .catch(() => 'ignore');
        }
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
        const partner = !R.is(Object, this.selectedModel.partner) && this.selectedModel.partner;
        const intervention = !R.is(Object, this.selectedModel.intervention) && this.selectedModel.intervention;
        const missingPartnerOrIntervention = !partner || (this.interventionsList.length && !intervention);
        const tasks = this.getFromStore('planingTasks.partnerTasks.tasks');

        if (missingPartnerOrIntervention && !!tasks && !!tasks.length) {
            this.dispatchOnStore(new SetPartnerTasks([]));
            return;
        } else if (missingPartnerOrIntervention) {
            return;
        }

        if (!this.interventionsList.length) {
            this.dispatchOnStore(loadPartnerTasks(this.selectedYear, { partner }));
        } else {
            this.dispatchOnStore(loadPartnerTasks(this.selectedYear, { partner, intervention }));
        }
    }

    public loadLocationsList() {
        const partnerAsObject = R.is(Object, this.selectedModel.partner);
        const interventionAsObject = R.is(Object, this.selectedModel.intervention);
        if (partnerAsObject || interventionAsObject) { return Promise.reject(); }

        const partner = this.selectedModel.partner;
        const intervention = this.selectedModel.intervention;

        if (partner && this.isGovernment(partner)) {
            this.dispatchOnStore(new SetInterventionLocations(this.locations || []));
            return Promise.resolve();
        } else if (intervention) {
            return this.dispatchOnStore(loadInterventionLocations(intervention));
        } else {
            this.dispatchOnStore(new SetInterventionLocations([]));
            return Promise.resolve();
        }
    }

    public checkDialogType(currentType: string, ...expectedTypes: string[]): boolean {
        return !!~expectedTypes.indexOf(currentType);
    }

    public isReadonlyField(permissions: PermissionsCollections, field: string, dependency: number, dialogType: string) {
        return dialogType === 'edit' || this.getReadonlyStatus(permissions, field) || !dependency;
    }

    public isInterventionRequired(permissions: PermissionsCollections, field: string, partner: number | null) {
        const isNotGovernment = !this.isGovernment(partner);
        return !!permissions && this.getRequiredStatus(permissions, field) || isNotGovernment;
    }

    public isGovernment(partner: number | null) {
        return !!partner && !!this.selectedOutput && !!this.selectedOutput.government_partners.find(
            (govPartner: Partner) => govPartner.id === partner
        );
    }

    public setEnableLocationSelect(partner: number | null, intervention: number | null): boolean {
        return !!partner && this.isGovernment(partner) || !!intervention;
    }

    public pageNumberChanged({detail}: CustomEvent) {
        this.updateQueryParams({page: detail.value});
        this.startLoad();
    }

    public pageSizeSelected({detail}: CustomEvent) {
        this.updateQueryParams({page_size: detail.value});
        this.startLoad();
    }

    public filterValueChanged({ detail, target }: CustomEvent) {
        const { selectedItems, selectedItem, value } = detail;
        const property = R.path(['dataset', 'property'], target);
        if (!property) { throw new Error('Filter must contain data property attribute'); }

        if (selectedItems) {
            const values = selectedItems.map((item: any) => item.id);
            this.updateQueryParams({page: 1, [property]: values});
        } else if (selectedItem || value) {
            this.updateQueryParams({page: 1, [property]: value || selectedItem.id});
        } else if (value === false) {
            this.removeQueryParams(property);
        } else {
            this.updateQueryParams({page: 1, [property]: []});
        }
        this.startLoad();
    }

    public sort({ detail }: CustomEvent) {
        const { field, direction } = detail;
        this.updateQueryParams({ordering: `${direction === 'desc' ? '-' : ''}${field}`});
        this.startLoad();
    }

    public getLocationPart(location: string = '', partToSelect: string) {
        const splittedLocation = location.match(/(.*)\s\[(.*)]/i) || [];
        switch (partToSelect) {
            case 'name':
                return splittedLocation[1];
            case 'code':
                return `[${splittedLocation[2]}]`;
            default:
                return location;
        }
    }

    private clearEditedField(field: string, path: string = field) {
        const exists = this.checkExistenceInList(field, path);
        if (!exists) {
            this.set(`selectedModel.${field}`, null);
        }
    }

    private checkExistenceInList(field: string, path: string = field) {
        const list = R.pathOr([], path.split('.'), this);
        return list.find(
            (item: any) => R.equals(this.selectedModel[field], item) || item.id === this.selectedModel[field]
        );
    }
}

customElements.define(PlanByTask.is, PlanByTask);