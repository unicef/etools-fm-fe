import { RunGlobalLoading, StopGlobalLoading } from '../../../redux-store/actions/global-loading.actions';
import {
    addSiteLocation,
    loadSiteLocations,
    removeSiteLocation,
    updateSiteLocation
} from '../../../redux-store/effects/site-specific-locations.effects';
import { LeafletMouseEvent, Marker } from 'leaflet';
import { AddNotification } from '../../../redux-store/actions/notification.actions';
import { locationsInvert } from './locations-invert';

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
            selectedModel: {
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
            (store: FMStore) => R.path(['staticData', 'currentWorkspace'], store),
            (workspace: Workspace | undefined) => {
                if (!workspace) { return; }
                this.defaultMapCenter = R.pathOr([-0.09, 51.505], ['point', 'coordinates'], workspace);
            });

        this.sitesSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['specificLocations', 'results'], store),
            (sites: IStatedListData<Site> | undefined) => {
                if (!sites) { return; }
                this._sitesObjects = sites || [];
                this.refreshData();
                this.renderMarkers();
            });

        this.permissionsSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['permissions', 'siteLocations'], store),
            (permissions: IPermissionActions | undefined) => {
                this.permissions = permissions;
                const statusOptions = permissions && this.getDescriptorChoices(permissions, 'is_active') || [];
                this.statusOptions = statusOptions.map((option: SiteStatusOption) => {
                    option.id = option.value ? 1 : 0;
                    return option;
                });
            });

        this.updateSiteLocationSubscriber = this.subscribeOnStore(
            (store: FMStore) => R.path(['specificLocations', 'updateInProcess'], store),
            (updateInProcess: boolean | null) => {
                this.savingInProcess = updateInProcess;
                if (updateInProcess !== false) { return; }

                this.errors = this.getFromStore('specificLocations.errors');
                if (R.path(['point'], this.errors)) {
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
        return {page: 1, page_size: 10, show_inactive: false};
    }

    public initStarLoad() {
        if (!this._sitesObjects.length) {
            this.startLoad();
        } else {
            this.refreshData();
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
        return R.is(Number, level) ? `Admin ${level}` : '';
    }

    public openDialog(event: MouseEvent): void {
        const icon = event.target;
        const dialogType = R.path(['dataset', 'type'], icon);
        if (!dialogType) { return; }

        const model = R.pathOr({is_active: true}, ['model', 'site'], event);
        const texts = this.dialogTexts[dialogType] || {};
        this.selectedModel = {...model};
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
                this.setCoordsString();
            });
            this.renderMarkers();
        }
        const coords = R.pathOr(this.defaultMapCenter, ['selectedModel', 'point', 'coordinates'], this);
        const reversedCoords = R.clone(coords).reverse();
        const zoom = coords === this.defaultMapCenter ? 8 : 15;
        this.map.setView(reversedCoords, zoom);

        const id = this.selectedModel.id;
        if (id) {
            this.dynamicMarker = this.staticMarkers.find((marker: any) => marker.staticData.id === id);
            this.dynamicMarker.openPopup();
        }

        this.setCoordsString();
    }

    public setCoordsString(): void {
        if (!this.dynamicMarker) {
            this.currentCoords = null;
        } else {
            const {lat, lng} = this.dynamicMarker.getLatLng();
            this.currentCoords = `Latitude ${lat.toFixed(6)}     Longitude ${lng.toFixed(6)}`;
        }
    }

    public resetData(event: CustomEvent): void {
        if (event.target !== this.$.dialog) { return; }
        this.dialog = null;
        this.resetInputs();
        this.selectedModel = {};
        this.errors = null;

        if (this.dynamicMarker && this.dynamicMarker.staticData) {
            const coords = R.clone(this.dynamicMarker.staticData.point.coordinates).reverse();
            this.dynamicMarker.setLatLng(coords).closePopup();
        } else if (this.dynamicMarker) {
            this.removeDynamicMarker();
        }
        (this.staticMarkers || []).forEach((marker: Marker) => marker.closePopup());
        this.dynamicMarker = null;
        this.setCoordsString();
    }

    public saveSite() {
        if (this.dialog.type === 'remove') {
            this.dispatchOnStore(removeSiteLocation(this.selectedModel.id));
            return;
        }

        const isActive = this.shadowRoot.querySelector('#statusDropdown').selected;
        this.selectedModel.is_active = !!isActive;

        const {lat, lng} = R.pathOr(() => ({}), ['dynamicMarker', 'getLatLng'], this).bind(this.dynamicMarker)();
        if (lat && lng) {
            this.selectedModel.point = {
                type: 'Point',
                coordinates: [lng, lat]
            };
        }

        const equalOrIsDeleteDialog = R.equals(this.originalData, this.selectedModel);
        if (equalOrIsDeleteDialog) {
            this.set('dialog.opened', false);
            return;
        }

        switch (this.dialog.type) {
            case 'add':
                this.dispatchOnStore(addSiteLocation(this.selectedModel));
                break;
            case 'edit':
                const changes = this.changesToRequest(this.originalData, this.selectedModel, this.permissions);
                this.dispatchOnStore(updateSiteLocation(this.selectedModel.id, changes));
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
        this.sites = locationsInvert(sitesObject);
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

    public pageNumberChanged({detail}: CustomEvent) {
        this.updateQueryParams({page: detail.value});
        this.refreshData();
    }

    public pageSizeSelected({detail}: CustomEvent) {
        this.updateQueryParams({page_size: detail.value});
        this.refreshData();
    }

    public changeShowInactive({ detail }: CustomEvent) {
        const checked = detail.value;
        if (checked) {
            this.updateQueryParams({show_inactive: checked, page: 1});
        } else {
            this.removeQueryParams('show_inactive');
            this.updateQueryParams({page: 1});
        }
        this.refreshData();
    }

    public searchKeyDown({ detail }: CustomEvent) {
        const { value } = detail;
        if (value === null || value === undefined) { return; }
        this._debounceSearch = Polymer.Debouncer.debounce(
            this._debounceSearch, Polymer.Async.timeOut.after(300), () => {
                if (!value.length) { this.removeQueryParams('search'); }
                if (value.length > 1) { this.updateQueryParams({search: value, page: 1}); }
                if (value.length !== 1) { this.refreshData(); }
            });
    }

    private renderMarkers() {
        if (!this.map) { return; }
        const sitesCoords = this._sitesObjects.map((site: Site) => {
            const coords = R.clone(site.point.coordinates).reverse();
            return {coords, staticData: site, popup: site.name};
        });
        this.setStaticMarkers(sitesCoords);
    }
}

customElements.define(SitesTab.is, SitesTab);
