import { CSSResultArray, customElement, LitElement, property, query, TemplateResult } from 'lit-element';
import { template } from './sites-popup.tpl';
import { Unsubscribe } from 'redux';
import { clone } from 'ramda';
import { store } from '../../../../../redux/store';
import { sitesUpdateSelector } from '../../../../../redux/selectors/site-specific-locations.selectors';
import { fireEvent } from '../../../../utils/fire-custom-event';
import {
    addSiteLocation,
    updateSiteLocation
} from '../../../../../redux/effects/site-specific-locations.effects';
import { LatLng, LatLngTuple, LeafletEvent, LeafletMouseEvent } from 'leaflet';
import { getDifference } from '../../../../utils/objects-diff';
import { MapHelper } from '../../../../common/map-mixin';
import { translate } from '../../../../../localization/localisation';
import { currentWorkspaceSelector } from '../../../../../redux/selectors/static-data.selectors';
import { SharedStyles } from '../../../../styles/shared-styles';
import { pageLayoutStyles } from '../../../../styles/page-layout-styles';
import { FlexLayoutClasses } from '../../../../styles/flex-layout-classes';
import { CardStyles } from '../../../../styles/card-styles';
import { leafletStyles } from '../../../../styles/leaflet-styles';
import { SitesTabStyles } from '../sites-tab.styles';

const DEFAULT_COORDINATES: LatLngTuple = [-0.09, 51.505];

@customElement('sites-popup')
export class SitesPopupComponent extends LitElement {

    @property() public dialogOpened: boolean = true;
    @property() public errors: GenericObject = {};
    @property() public selectedModel: EditedSite = { is_active: true };
    @property() public currentCoords: string | null = null;

    public defaultMapCenter: LatLngTuple = DEFAULT_COORDINATES;
    public savingInProcess: boolean = false;
    public readonly statusOptions: SiteStatusOption[] = [
        { id: 0, value: false, display_name: translate('SITES.STATUS.INACTIVE') },
        { id: 1, value: true, display_name: translate('SITES.STATUS.ACTIVE') }
    ];

    @query('#map') private maoElement!: HTMLElement;
    private sitesObjects: Site[] | null = null;
    private originalData: Site | null = null;
    private readonly updateSiteLocationUnsubscribe: Unsubscribe;
    private readonly currentWorkspaceUnsubscribe: Unsubscribe;
    private readonly MapHelper: MapHelper;

    public set data(data: SitesPopupData) {
        if (!data) { return; }
        const { model, sitesObjects }: SitesPopupData = data;

        this.sitesObjects = sitesObjects || [];
        if (!model) { return; }
        this.selectedModel = { ...this.selectedModel, ...model };
        this.originalData = clone(model);
    }

    public constructor() {
        super();
        this.MapHelper = new MapHelper();
        this.updateSiteLocationUnsubscribe = store.subscribe(sitesUpdateSelector( (updateInProcess: boolean | null) => {
            this.savingInProcess = Boolean(updateInProcess);
            if (updateInProcess !== false) { return; }

            this.errors = store.getState().specificLocations.errors;
            if (this.errors && this.errors.point) {
                fireEvent(this, 'toast', {
                    text: 'Please, select correct location on map',
                    showCloseBtn: false
                });
            }
            if (this.errors && Object.keys(this.errors).length) { return; }

            this.dialogOpened = false;
            fireEvent(this, 'response', { confirmed: true });
        }, false));

        this.currentWorkspaceUnsubscribe = store.subscribe(
            currentWorkspaceSelector((workspace: Workspace | undefined) => {
                if (!workspace) { return; }
                this.defaultMapCenter = workspace.point && workspace.point.coordinates || DEFAULT_COORDINATES;
            }));
    }

    public render(): TemplateResult {
        return template.call(this);
    }

    public connectedCallback(): void {
        super.connectedCallback();
    }

    public disconnectedCallback(): void {
        super.disconnectedCallback();
        this.updateSiteLocationUnsubscribe();
        this.currentWorkspaceUnsubscribe();
    }

    public onClose(): void {
        fireEvent(this, 'response', { confirmed: false });
    }

    public saveSite(): void {
        const { lat, lng }: LatLng =
        this.MapHelper.dynamicMarker && this.MapHelper.dynamicMarker.getLatLng() || {} as LatLng;
        if (lat && lng) {
            this.selectedModel.point = {
                type: 'Point',
                coordinates: [lng, lat]
            };
        }

        const site: EditedSite = this.originalData !== null ?
            getDifference<EditedSite>(this.originalData, this.selectedModel, { toRequest: true }) :
            this.selectedModel;
        const isEmpty: boolean = !Object.keys(site).length;

        if (isEmpty) {
            this.dialogOpened = false;
            this.onClose();
        } else if (this.originalData && this.originalData.id) {
            store.dispatch<AsyncEffect>(updateSiteLocation(this.selectedModel.id as number, site));
        } else {
            store.dispatch<AsyncEffect>(addSiteLocation(this.selectedModel as Site));
        }
    }

    public updateModelValue(fieldName: keyof EditedSite, value: any): void {
        if (!this.selectedModel) { return; }
        this.selectedModel[fieldName] = value;
    }

    public setStatusValue(active: boolean): 1 | 0 {
        return active ? 1 : 0;
    }

    public mapInitialization(): void {
        if (!this.MapHelper.map) {
            this.MapHelper.initMap(this.maoElement);
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

    public resetFieldError(fieldName: string): void {
        if (!this.errors) { return; }
        delete this.errors[fieldName];
        this.performUpdate();
    }

    private renderMarkers(): void {
        if (!this.MapHelper.map || !this.sitesObjects) { return; }
        const sitesCoords: MarkerDataObj[] = this.sitesObjects.map((site: Site) => {
            const coords: LatLngTuple = [...site.point.coordinates].reverse() as LatLngTuple;
            return { coords, staticData: site, popup: site.name };
        });
        this.MapHelper.setStaticMarkers(sitesCoords);
    }

    private setCoordsString(): void {
        if (!this.MapHelper.dynamicMarker) {
            this.currentCoords = null;
        } else {
            const { lat, lng } = this.MapHelper.dynamicMarker.getLatLng();
            this.currentCoords =
                `${ translate('MAIN.LATITUDE') } ${lat.toFixed(6)}` +
                `     ${ translate('MAIN.LONGITUDE') } ${lng.toFixed(6)}`;
        }
    }

    public static get styles(): CSSResultArray {
        return [SharedStyles, pageLayoutStyles, FlexLayoutClasses, CardStyles, leafletStyles, SitesTabStyles];
    }
}
