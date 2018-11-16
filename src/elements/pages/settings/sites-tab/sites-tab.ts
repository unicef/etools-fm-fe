import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';
import {
    addSiteLocation,
    loadSiteLocations,
    removeSiteLocation,
    updateSiteLocation
} from '../../../redux-store/effects/site-specific-locations.effects';
import { LeafletMouseEvent, Marker } from 'leaflet';
import { AddNotification } from '../../../redux-store/actions/notification.actions';

class SitesTab extends EtoolsMixinFactory.combineMixins([
    FMMixins.CommonMethods,
    FMMixins.ReduxMixin,
    FMMixins.RouteHelperMixin,
    FMMixins.MapMixin,
    FMMixins.TextareaMaxRowsMixin,
    FMMixins.ProcessDataMixin], Polymer.Element) {

    public static get is() { return 'sites-tab'; }

    public static get properties() {
        return {
            sites: {
                type: Object,
                value: () => []
            },
            _sitesObjects: {
                type: Object,
                value: () => []
            },
            editedItem: {
                type: Object,
                value: () => ({})
            },
            count: Number,
            dialogTexts: {
                type: Object,
                value: {
                    add: {title: 'Add Site Specific Location', confirm: 'Add', type: 'add', theme: 'default'},
                    edit: {title: 'Edit Site Specific Location', confirm: 'Save', type: 'edit', theme: 'default'},
                    remove: {type: 'remove', theme: 'confirmation'}
                }
            },
            defaultMapCenter: Array
        };
    }

    public connectedCallback() {
        super.connectedCallback();
        this.currentWorkspaceSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'staticData.currentWorkspace'),
            (workspace: Workspace | undefined) => {
                if (!workspace) { return; }
                this.defaultMapCenter = _.get(workspace, 'point.coordinates', [-0.09, 51.505]);
            });

        this.sitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'specificLocations'),
            (sites: IStatedListData<Site> | undefined) => {
                if (!sites) { return; }
                this._sitesObjects = sites.results || [];
                this.refreshData();
                this.count = sites.count || 0;
                this.renderMarkers();
            });

        this.permissionsSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'permissions.siteLocations'),
            (permissions: IPermissionActions | undefined) => {
                this.permissions = permissions;
                const statusOptions = permissions && this.getDescriptorChoices(permissions, 'is_active') || [];
                this.statusOptions = statusOptions.map((option: SiteStatusOption) => {
                    option.id = option.value ? 1 : 0;
                    return option;
                });
            });

        this.updateSiteLocationSubscriber = this.subscribeOnStore(
            (store: FMStore) => _.get(store, 'specificLocations.updateInProcess'),
            (updateInProcess: boolean | null) => {
                this.savingInProcess = updateInProcess;
                if (updateInProcess !== false) { return; }

                this.errors = this.getFromStore('specificLocations.errors');
                if (_.get(this.errors, 'point')) {
                    this.dispatchOnStore(new AddNotification('Please, select correct location on map'));
                }
                if (this.errors) { return; }

                if (this.dialog.type === 'add') {
                    this.updateQueryParams({page: 1});
                }
                this.set('dialog.opened', false);
                this.startLoad();
            });
    }

    public getInitQueryParams(): QueryParams {
        return {page: 1, page_size: 10, show_inactive: true};
    }

    public initStarLoad() {
        if (!this._sitesObjects.length) {
            this.startLoad();
        }
    }

    public disconnectedCallback() {
        super.disconnectedCallback();
        this.sitesSubscriber();
        this.permissionsSubscriber();
        this.updateSiteLocationSubscriber();
        this.currentWorkspaceSubscriber();
    }

    public getActiveClass(isActive: boolean): string {
        return isActive ? 'active' : '';
    }

    public getAdminLevel(level: number | null): string {
        return _.isNumber(level) ? `Admin ${level}` : '';
    }

    public openDialog(event: MouseEvent): void {
        const icon = event.target;
        const dialogType = _.get(icon, 'dataset.type');
        if (!dialogType) { return; }

        const model = _.get(event, 'model.site', {});
        const texts = this.dialogTexts[dialogType] || {};
        this.editedItem = {...model};
        this.originalData = {...model};
        this.dialog = {opened: true, ...texts};
    }

    public mapInitialization(event: CustomEvent) {
        if (event.target !== this.$.dialog) { return; }
        if (this.dialog.type === 'remove') { return; }
        if (!this.map) {
            const mapContainer = this.shadowRoot.querySelector('#map');
            this.initMap(mapContainer);
            this.map.on('click', (clickEvent: LeafletMouseEvent) => {
                const {lat, lng} = clickEvent.latlng;
                this.changeDMLocation([lat, lng]);
            });
            this.renderMarkers();
        }
        const coords = _.get(this, 'editedItem.point.coordinates', this.defaultMapCenter);
        const reversedCoords = _.clone(coords).reverse();
        const zoom = coords === this.defaultMapCenter ? 8 : 15;
        this.map.setView(reversedCoords, zoom);

        const id = this.editedItem.id;
        if (id) {
            this.dynamicMarker = this.staticMarkers.find((marker: any) => marker.staticData.id === id);
            this.dynamicMarker.openPopup();
        }
    }

    public resetData(event: CustomEvent): void {
        if (event.target !== this.$.dialog) { return; }
        this.dialog = null;
        this.resetInputs();
        this.editedItem = {};
        this.errors = null;

        if (this.dynamicMarker && this.dynamicMarker.staticData) {
            const coords = _.clone(this.dynamicMarker.staticData.point.coordinates).reverse();
            this.dynamicMarker.setLatLng(coords).closePopup();
        } else if (this.dynamicMarker) {
            this.removeDynamicMarker();
        }
        _.each(this.staticMarkers, (marker: Marker) => marker.closePopup());
        this.dynamicMarker = null;
    }

    public saveSite() {
        if (this.dialog.type === 'remove') {
            this.dispatchOnStore(removeSiteLocation(this.editedItem.id));
            return;
        }

        const isActive = this.shadowRoot.querySelector('#statusDropdown').selected;
        this.editedItem.is_active = !!isActive;

        const {lat, lng} = _.result(this, 'dynamicMarker.getLatLng', {});
        if (lat && lng) {
            this.editedItem.point = {
                type: 'Point',
                coordinates: [lng, lat]
            };
        }

        const equalOrIsDeleteDialog = _.isEqual(this.originalData, this.editedItem);
        if (equalOrIsDeleteDialog) {
            this.set('dialog.opened', false);
            return;
        }

        switch (this.dialog.type) {
            case 'add':
                this.dispatchOnStore(addSiteLocation(this.editedItem));
                break;
            case 'edit':
                const changes = this.changesToRequest(this.originalData, this.editedItem, this.permissions);
                this.dispatchOnStore(updateSiteLocation(this.editedItem.id, changes));
                break;
        }
    }

    public isRemoveDialog(theme: string): boolean {
        return theme === 'confirmation';
    }

    public isEditDialog(type: string): boolean {
        return type === 'edit';
    }

    public setStatusValue(active: boolean) {
        return active ? 1 : 0;
    }

    public finishLoad() {
        this._debounceLoadData = Polymer.Debouncer.debounce(this._debounceLoadData,
            Polymer.Async.timeOut.after(100), () => {
                this.dispatchOnStore(new RunGlobalLoading({type: 'specificLocations', message: 'Loading Data...'}));
                this.dispatchOnStore(loadSiteLocations())
                    .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'specificLocations'})));
            });
    }

    public refreshData() {
        let sitesObject = this.filterSites(this._sitesObjects);
        this.count = sitesObject.length;
        sitesObject = this._filterPagination(sitesObject);
        this.sites = this.regroupSitesByParent(sitesObject);
    }

    public _filterShowInactive(sitesObject: Site[]): Site[] {
        if (!this.queryParams) { return sitesObject; }
        if (!this.queryParams.show_inactive) {
            return sitesObject.filter((site) => site.is_active);
        }
        return sitesObject;
    }

    public _filterPagination(sitesObject: Site[]): Site[] {
        if (!this.queryParams) { return sitesObject; }
        const page = this.queryParams.page;
        const pageSize = this.queryParams.page_size;
        if (!page || !pageSize) { return sitesObject; }
        const startIndex = page * pageSize - pageSize;
        const endIndex = page * pageSize;
        return sitesObject.slice(startIndex, endIndex);
    }

    public _filterSearch(sitesObject: Site[]): Site[] {
        if (!this.queryParams) { return sitesObject; }
        if (this.queryParams.search) {
            const match = this.queryParams.search.toLowerCase();
            return sitesObject.filter((site) => {
                const siteName = site.parent.name.toLowerCase();
                const parentName = site.name.toLowerCase();
                return !!~siteName.indexOf(match) || !!~parentName.indexOf(match);
            });
        }
        return sitesObject;
    }

    public filterSites(sitesObject: Site[]): Site[] {
        const sites = this._filterShowInactive(sitesObject);
        return this._filterSearch(sites);
    }

    public _pageNumberChanged({detail}: CustomEvent) {
        this.updateQueryParams({page: detail.value});
        this.refreshData();
    }

    public _pageSizeSelected({detail}: CustomEvent) {
        this.updateQueryParams({page_size: detail.value});
        this.refreshData();
    }

    public _changeShowInactive({ detail }: CustomEvent) {
        const checked = detail.value;
        if (checked) {
            this.updateQueryParams({show_inactive: checked});
        } else {
            this.removeQueryParams('show_inactive');
        }
        this.refreshData();
    }

    public _searchKeyDown({ detail }: CustomEvent) {
        const { value } = detail;
        if (value === null || value === undefined) { return; }
        this._debounceSearch = Polymer.Debouncer.debounce(
            this._debounceSearch, Polymer.Async.timeOut.after(300), () => {
                if (!value.length) { this.removeQueryParams('search'); }
                if (value.length > 1) { this.updateQueryParams({search: value, page: 1}); }
                if (value.length !== 1) { this.refreshData(); }
            });
    }

    private regroupSitesByParent(sites: Site[]): IGroupedSites[] {
        return _(sites)
            .groupBy((site: Site) => site.parent.id)
            .map((groupedSites: Site[]) => {
                const parent = groupedSites[0].parent;
                return {...parent, sites: groupedSites};
            })
            .sortBy('name')
            .value();
    }

    private renderMarkers() {
        if (!this.map) { return; }
        const sitesCoords = this._sitesObjects.map((site: Site) => {
            const coords = _.clone(site.point.coordinates).reverse();
            return {coords, staticData: site, popup: site.name};
        });
        this.setStaticMarkers(sitesCoords);
    }
}

customElements.define(SitesTab.is, SitesTab);
