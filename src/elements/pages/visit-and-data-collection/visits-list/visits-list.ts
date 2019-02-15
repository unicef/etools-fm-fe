import { loadPlanedTotal, loadVisitsList, loadVisitsTotalInfo } from '../../../redux-store/effects/visits.effects';
import { loadStaticData } from '../../../redux-store/effects/load-static-data.effect';
import { getEndpoint } from '../../../app-config/app-config';
import { loadPermissions } from '../../../redux-store/effects/load-permissions.effect';
import { getLocationPart } from '../../../common-elements/get-location-part';

class VisitsList extends EtoolsMixinFactory.combineMixins([
    FMMixins.AppConfig,
    FMMixins.RouteHelperMixin,
    FMMixins.ReduxMixin,
    FMMixins.ProcessDataMixin], Polymer.Element) {
    public static get is() { return 'visits-list'; }

    public static get properties() {
        return {
            count: Number,
            listFilterOptions: {
                type: Object,
                value: () => [{
                    name: 'CP Output',
                    query: 'tasks__cp_output_config__in',
                    optionsKey: 'cpOutputsFilter',
                    label: 'name',
                    value: 'id'
                }, {
                    name: 'Partner',
                    query: 'tasks__partner__in',
                    optionsKey: 'partnersFilter',
                    label: 'name',
                    value: 'id'
                }, {
                    name: 'Location',
                    query: 'location__in',
                    optionsKey: 'locationsFilter',
                    label: 'name',
                    value: 'id'
                }, {
                    name: 'Status',
                    query: 'status__in',
                    optionsKey: 'statusFilter',
                    label: 'display_name',
                    value: 'value'
                }, {
                    name: 'Team Member',
                    query: 'team_members__in',
                    optionsKey: 'teamMembersFilter',
                    label: 'name',
                    value: 'id'
                }, {
                    name: 'Site',
                    query: 'location_site__in',
                    optionsKey: 'sitesFilter',
                    label: 'name',
                    value: 'id'
                }]
            }
        };
    }

    public connectedCallback() {
        super.connectedCallback();

        this.addEventListener('sort-changed', this.sort);

        const endpoint = getEndpoint('visits');
        this.dispatchOnStore(loadPermissions(endpoint.url, 'visits'));
        this.updateFiltersData();
        this.dispatchOnStore(loadVisitsTotalInfo());
        this.dispatchOnStore(loadPlanedTotal());

        this.visitsListaSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['visitsData', 'list'], store),
            (visits: IListData<Visit>) => {
                this.visits = visits.results || [];
                this.count = visits.count;
            });

        this.visitsTotalSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['visitsData', 'totalInfo'], store),
            (totalInfo: VisitsTotalPlanned) => this.visitsTotalInfo = totalInfo);

        this.plannedTotalSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['visitsData', 'totalInfoPlanned'], store),
            (totalInfo: PlannedTotal) => this.plannedTotalInfo = totalInfo);

        this.filterLocationsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'visitLocationsFilter'], store),
            (locations: Location[]) => { this.locationsFilter = locations; });

        this.filterTeamMembersSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'visitTeamMembersFilter'], store),
            (teamMembers: IPrimaryFieldMonitor[]) => { this.teamMembersFilter = teamMembers; });

        this.filterPartnersSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'visitPartnersFilter'], store),
            (partners: Partner[]) => { this.partnersFilter = partners; });

        this.filterCpOutputsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'visitCpOutputsFilter'], store),
            (cpOutputs: CpOutput[]) => { this.cpOutputsFilter = cpOutputs; });

        this.filterSitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['staticData', 'visitSitesFilter'], store),
            (sites: Site[]) => { this.sitesFilter = sites; });

        this.permissionsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'visits'], store),
            (permissions: IPermissionActions | undefined) =>  {
                this.permissions = permissions;
                this.statusFilter = permissions && this.getDescriptorChoices(permissions, 'status');
            });
    }

    public getInitQueryParams(): QueryParams {
        return {
            page: 1,
            page_size: 10,
            tasks__cp_output_config__in: [],
            tasks__partner__in: [],
            team_members__in: [],
            location__in: [],
            location_site__in: [],
            status__in: []
        };
    }

    public finishLoad() {
        this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
            Polymer.Async.timeOut.after(100), () => {
                this.dispatchOnStore(loadVisitsList(this.queryParams));
            });
    }

    public getLocationPart(location: string = '', partToSelect: string) {
        return getLocationPart(location, partToSelect);
    }

    public getIndex(index: number): number {
        return index + 1;
    }

    public getFormattedDate(date: string): string {
        return moment(date).format('DD MMM YYYY');
    }

    public sort({ detail }: CustomEvent) {
        const { field, direction } = detail;
        this.updateQueryParams({ordering: `${direction === 'desc' ? '-' : ''}${field}`});
        this.startLoad();
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
        const { selectedItems } = detail;
        const property = R.path(['dataset', 'property'], target);
        const optionsKey = R.path(['dataset', 'optionsKey'], target);
        if (!this[optionsKey]) { return; }
        if (!property) { throw new Error('Filter must contain data property attribute'); }

        if (selectedItems) {
            const values = selectedItems.map((item: any) => item.id || item.value);
            this.updateQueryParams({page: 1, [property]: values});
            if (values.length) { this.toggleFilter(property, true); }
        } else {
            this.updateQueryParams({page: 1, [property]: []});
        }
        this.startLoad();
    }

    public onFilterSelect({ model }: EventModel<Filter>) {
        const { item } = model;
        this.toggleFilter(item.query);
    }

    public toggleFilter(filterQuery: string, state?: boolean) {
        const index = this.listFilterOptions.findIndex((filter: Filter) => filter.query === filterQuery);
        if (index === -1) { return; }

        const currentState = this.get(`listFilterOptions.${index}.selected`);
        const newState = R.is(Boolean, state) ? state : !currentState;
        if (currentState !== newState) {
            this.set(`listFilterOptions.${index}.selected`, newState);
        }
        if (!newState && this.queryParams[filterQuery] && this.queryParams[filterQuery].length) {
            this.updateQueryParams({page: 1, [filterQuery]: []});
        }
    }

    public getOptions(collectionName: string) {
        return this[collectionName] || [];
    }

    public simplifyValue(queryName: string) {
        return this._simplifyValue(this.queryParams && this.queryParams[queryName]);
    }

    public getTeamMembers(teamMembers: TeamMember[]) {
        return teamMembers.map((member: TeamMember) => member.name).join(', ');
    }

    private updateFiltersData() {
        this.dispatchOnStore(loadStaticData('visitLocationsFilter', null, true));
        this.dispatchOnStore(loadStaticData('visitTeamMembersFilter', null, true));
        this.dispatchOnStore(loadStaticData('visitPartnersFilter', null, true));
        this.dispatchOnStore(loadStaticData('visitCpOutputsFilter', null, true));
        this.dispatchOnStore(loadStaticData('visitSitesFilter', null, true));
    }

}

customElements.define(VisitsList.is, VisitsList);
