import { CSSResult, customElement, LitElement, property, query, TemplateResult } from 'lit-element';
import { template } from './sites-tab.tpl';
import { store } from '../../../../redux/store';
import { Unsubscribe } from 'redux';
import { sitesSelector, sitesUpdateSelector } from '../../../../redux/selectors/site-specific-locations.selectors';
import { routeDetailsSelector } from '../../../../redux/selectors/app.selectors';
import { loadSiteLocations } from '../../../../redux/effects/site-specific-locations.effects';
import { currentWorkspaceSelector } from '../../../../redux/selectors/static-data.selectors';
import { updateQueryParams } from '../../../../routing/routes';
import { locationsInvert } from './locations-invert';
import { IMarker, MapHelper } from '../../../common/map-mixin';
import { LatLngTuple, LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { elevationStyles } from '../../../styles/lit-styles/elevation-styles';
import { debounce } from '../../../utils/debouncer';

const DEFAULT_COORDINATES: LatLngTuple = [-0.09, 51.505];

@customElement('sites-tab')
export class SitesTabComponent extends LitElement {
    public defaultMapCenter: LatLngTuple = DEFAULT_COORDINATES;
    public savingInProcess: boolean | null = null;
    public errors: GenericObject | null = null;
    public count: number = 0;
    @property() public sites: IGroupedSites[] = [];
    public selectedModel: EditedSite | null = null;
    public currentCoords: string | null = null;
    public queryParams: IRouteQueryParam | null = null;
    @property() public dialog: DialogData | null = { opened: false };

    protected originalData: EditedSite | null = null;

    private sitesObjects: Site[] | null = null;
    private debouncedLoading: Callback;
    private sitesUnsubscribe!: Unsubscribe;
    private routeUnsubscribe!: Unsubscribe;
    private currentWorkspaceUnsubscribe!: Unsubscribe;
    private updateSiteLocationUnsubscribe!: Unsubscribe;
    @query('#dialog') private readonly dialogElement!: HTMLElement;

    private readonly dialogTexts: GenericObject<DialogData> = {
        add: { title: 'Add Site Specific Location', confirm: 'Add', type: 'add', theme: 'default', opened: false },
        edit: { title: 'Edit Site Specific Location', confirm: 'Save', type: 'edit', theme: 'default', opened: false },
        remove: { type: 'remove', theme: 'confirmation', opened: false }
    };
    private MapHelper: MapHelper;

    public constructor() {
        super();
        this.MapHelper = new MapHelper();
        this.debouncedLoading = debounce(() => {
            // this.dispatchOnStore(new RunGlobalLoading({type: 'specificLocations', message: 'Loading Data...'}));
            store.dispatch<AsyncEffect>(loadSiteLocations());
            // .then(() => this.dispatchOnStore(new StopGlobalLoading({type: 'specificLocations'})));
        }, 100);
    }

    public render(): TemplateResult | void {
        return template.apply(this);
    }

    public connectedCallback(): void {
        super.connectedCallback();
        this.currentWorkspaceUnsubscribe = store.subscribe(
            currentWorkspaceSelector((workspace: Workspace | undefined) => {
                if (!workspace) { return; }
                this.defaultMapCenter = workspace.point && workspace.point.coordinates || DEFAULT_COORDINATES;
            }));

        this.routeUnsubscribe = store.subscribe(routeDetailsSelector(({ routeName, subRouteName, queryParams }: IRouteDetails) => {
            if (routeName !== 'settings' || subRouteName !== 'sites') { return; }

            const paramsAreValid: boolean = this.checkParams(queryParams);
            if (paramsAreValid) {
                this.queryParams = queryParams;
            }

            if (!this.sitesObjects) {
                this.debouncedLoading();
            } else {
                this.refreshData();
            }
        }));

        this.sitesUnsubscribe = store.subscribe(sitesSelector((sites: Site[] | null) => {
                if (!sites) { return; }
                this.sitesObjects = sites;
                this.refreshData();
                // this.renderMarkers();
        }));

        this.updateSiteLocationUnsubscribe = store.subscribe(sitesUpdateSelector( (updateInProcess: boolean | null) => {
                this.savingInProcess = updateInProcess;
                if (updateInProcess !== false) { return; }

                this.errors = store.getState().specificLocations.errors;
                if (this.errors && this.errors.point) {
                    // this.dispatchOnStore(new AddNotification('Please, select correct location on map'));
                }
                if (this.errors) { return; }

                if (this.dialog && this.dialog.type === 'add') {
                    updateQueryParams({ page: 1 });
                }
                this.dialog = { ...this.dialog, opened: false };

                store.dispatch<AsyncEffect>(loadSiteLocations());
            })
        );
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.sitesUnsubscribe();
        this.routeUnsubscribe();
        this.currentWorkspaceUnsubscribe();
        this.updateSiteLocationUnsubscribe();
    }

    public checkParams(params?: IRouteQueryParams | null): boolean {
        if (!params || !params.page || !params.page_size) {
            updateQueryParams({ page: 1, page_size: 10 });
            return false;
        }
        return true;
    }

    public getActiveClass(isActive: boolean): string {
        return isActive ? 'active' : '';
    }

    public getAdminLevel(level: number | null | string): string {
        return typeof level !== 'object' ? `Admin ${level}` : '';
    }

    public isRemoveDialog(theme: string): boolean {
        return theme === 'confirmation';
    }

    public isEditDialog(type: string): boolean {
        return type === 'edit';
    }

    public setStatusValue(active: boolean): 1 | 0 {
        return active ? 1 : 0;
    }

    public saveSite(): void {}

    public openDialog(event: MouseEvent): void {
        const icon: HTMLElement = event.target as HTMLElement;
        const dialogType: string | undefined = icon.dataset.type;
        if (!dialogType) { return; }

        const model: EditedSite = (event as any).model && (event as any).model.site || { is_active: true };
        const texts: DialogData = this.dialogTexts[dialogType] || {};
        this.selectedModel = { ...model };
        this.originalData = { ...model };
        this.dialog = { ...texts, opened: true };
    }

    public mapInitialization(event: CustomEvent): void {
        if (event.target !== this.dialogElement) { return; }
        if (!this.dialog || this.dialog.type === 'remove') { return; }
        if (!this.MapHelper.map) {
            const mapContainer: HTMLElement | null = this.shadowRoot!.querySelector('#map');
            this.MapHelper.initMap(mapContainer);
            this.MapHelper.map!.on('click', (clickEvent: LeafletEvent) => {
                const { lat, lng } = (clickEvent as LeafletMouseEvent).latlng;
                this.MapHelper.changeDMLocation([lat, lng]);
                this.setCoordsString();
            });
            this.renderMarkers();
        }
        const coords: LatLngTuple = this.selectedModel && this.selectedModel.point &&
            this.selectedModel.point.coordinates || this.defaultMapCenter;
        const reversedCoords: LatLngTuple = [...coords].reverse() as LatLngTuple;
        const zoom: number = coords === this.defaultMapCenter ? 8 : 15;
        this.MapHelper.map!.setView(reversedCoords, zoom);

        const id: number | null = this.selectedModel && this.selectedModel.id || null;
        if (id) {
            this.MapHelper.dynamicMarker = this.MapHelper.staticMarkers!.find((marker: any) => marker.staticData.id === id) || null;
            this.MapHelper.dynamicMarker!.openPopup();
        }

        this.setCoordsString();
    }

    public pageNumberChanged({ detail }: CustomEvent): void {
        // prevent updating during initialization
        if (!this.sitesObjects) { return; }
        updateQueryParams({ page: detail.value });
        this.refreshData();
    }

    public pageSizeSelected({ detail }: CustomEvent): void {
        // prevent updating during initialization
        if (!this.sitesObjects) { return; }
        updateQueryParams({ page_size: detail.value });
        this.refreshData();
    }

    public changeShowInactive({ detail }: CustomEvent): void {
        // prevent updating during initialization
        if (!this.sitesObjects) { return; }
        const checked: boolean = detail.value;
        if (checked) {
            updateQueryParams({ show_inactive: checked, page: 1 });
        } else {
            updateQueryParams({ show_inactive: null, page: 1 });
        }
        this.refreshData();
    }

    public searchKeyDown({ detail }: CustomEvent): void {
        const { value } = detail;
        if (value === null || value === undefined) { return; }

        if (!value.length) { updateQueryParams({ search: null }); }
        if (value.length > 1) { updateQueryParams({ search: value, page: 1 }); }
        if (value.length !== 1) { this.refreshData(); }
    }

    public resetData(event: CustomEvent): void {
        if (event.target !== this.dialogElement) { return; }
        this.dialog = null;
        // this.resetInputs();
        this.selectedModel = {};
        this.errors = null;

        if (this.MapHelper.dynamicMarker && this.MapHelper.dynamicMarker.staticData) {
            const coords: LatLngTuple = [...this.MapHelper.dynamicMarker.staticData.point.coordinates]
                .reverse() as LatLngTuple;
            this.MapHelper.dynamicMarker.setLatLng(coords).closePopup();
        } else if (this.MapHelper.dynamicMarker) {
            this.MapHelper.removeDynamicMarker();
        }
        (this.MapHelper.staticMarkers || []).forEach((marker: IMarker) => marker.closePopup());
        this.MapHelper.dynamicMarker = null;
        this.setCoordsString();
    }

    private refreshData(): void {
        let sitesObject: Site[] = this.filterSites(this.sitesObjects || []);
        this.count = sitesObject.length;
        sitesObject = this.filterPagination(sitesObject);
        this.sites = locationsInvert(sitesObject);
    }

    private filterSites(sitesObject: Site[]): Site[] {
        const sites: Site[] = this.filterShowInactive(sitesObject);
        return this.filterSearch(sites);
    }

    private filterShowInactive(sitesObject: Site[]): Site[] {
        if (!this.queryParams) { return sitesObject; }
        if (!this.queryParams.show_inactive) {
            return sitesObject.filter((site: Site) => site.is_active);
        }
        return sitesObject;
    }

    private filterPagination(sitesObject: Site[]): Site[] {
        if (!this.queryParams) { return sitesObject; }
        const page: number = +this.queryParams.page;
        const pageSize: number = +this.queryParams.page_size;
        if (!page || !pageSize) { return sitesObject; }
        const startIndex: number = page * pageSize - pageSize;
        const endIndex: number = page * pageSize;
        return sitesObject.slice(startIndex, endIndex);
    }

    private filterSearch(sitesObject: Site[]): Site[] {
        if (!this.queryParams) { return sitesObject; }
        if (this.queryParams.search) {
            const match: string = this.queryParams.search.toLowerCase();
            return sitesObject.filter((site: Site) => {
                const siteName: string = site.parent.name.toLowerCase();
                const parentName: string = site.name.toLowerCase();
                return !!~siteName.indexOf(match) || !!~parentName.indexOf(match);
            });
        }
        return sitesObject;
    }

    private setCoordsString(): void {
        if (!this.MapHelper.dynamicMarker) {
            this.currentCoords = null;
        } else {
            const { lat, lng } = this.MapHelper.dynamicMarker.getLatLng();
            this.currentCoords = `Latitude ${lat.toFixed(6)}     Longitude ${lng.toFixed(6)}`;
        }
    }

    private renderMarkers(): void {
        if (!this.MapHelper.map || !this.sitesObjects) { return; }
        const sitesCoords: MarkerDataObj[] = this.sitesObjects.map((site: Site) => {
            const coords: LatLngTuple = [...site.point.coordinates].reverse() as LatLngTuple;
            return { coords, staticData: site, popup: site.name };
        });
        this.MapHelper.setStaticMarkers(sitesCoords);
    }

    public static get styles(): CSSResult[] {
        return [elevationStyles];
    }
}
