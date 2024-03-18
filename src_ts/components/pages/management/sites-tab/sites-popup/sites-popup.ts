import {css, LitElement, TemplateResult, CSSResultArray} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {template} from './sites-popup.tpl';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../redux/store';
import {sitesUpdateSelector} from '../../../../../redux/selectors/site-specific-locations.selectors';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {addSiteLocation, updateSiteLocation} from '../../../../../redux/effects/site-specific-locations.effects';
import {getDifference} from '../../../../utils/objects-diff';
import {IMarker, MapHelper} from '../../../../common/map-mixin';
import {currentWorkspaceSelector} from '../../../../../redux/selectors/static-data.selectors';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {layoutStyles} from '@unicef-polymer/etools-unicef/src/styles/layout-styles';
import {CardStyles} from '../../../../styles/card-styles';
import {leafletStyles} from '../../../../styles/leaflet-styles';
import {SitesTabStyles} from '../sites-tab.styles';
import {DataMixin} from '../../../../common/mixins/data-mixin';
import {debounce} from '@unicef-polymer/etools-utils/dist/debouncer.util';
import {translate, get as getTranslation} from 'lit-translate';
import {applyDropdownTranslation} from '../../../../utils/translation-helper';
import {STATUS_OPTIONS} from '../../../../common/dropdown-options';
import {activeLanguageSelector} from '../../../../../redux/selectors/active-language.selectors';
import {validateRequiredFields} from '../../../../utils/validations.helper';

const DEFAULT_COORDINATES: L.LatLngTuple = [-0.09, 51.505];
const LAT_LNG_DEBOUNCE_TIME = 300;

@customElement('sites-popup')
export class SitesPopupComponent extends DataMixin()<Site>(LitElement) {
  @property() dialogOpened = true;
  @property() savingInProcess = false;
  @property() editedData: EditedSite = {is_active: true};
  @property() currentCoords: string | null = null;

  @property() latitude: number | null = null;
  @property() longitude: number | null = null;
  @property() statusOptions: SiteStatusOption[] = applyDropdownTranslation(STATUS_OPTIONS);
  @property() autoValidateName = false;

  @query('#map') private mapElement!: HTMLElement;

  defaultMapCenter: L.LatLngTuple = DEFAULT_COORDINATES;

  private sitesObjects: Site[] | null = null;
  private readonly updateSiteLocationUnsubscribe: Unsubscribe;
  private readonly currentWorkspaceUnsubscribe: Unsubscribe;
  private readonly MapHelper: MapHelper;
  private readonly setLatLngWithDelay: Callback;
  private readonly activeLanguageUnsubscribe: Unsubscribe;

  constructor() {
    super();
    this.MapHelper = new MapHelper();
    this.setLatLngWithDelay = debounce(this.updateMapPoint.bind(this), LAT_LNG_DEBOUNCE_TIME);
    this.updateSiteLocationUnsubscribe = store.subscribe(
      sitesUpdateSelector((updateInProcess: boolean | null) => {
        this.savingInProcess = Boolean(updateInProcess);
        if (updateInProcess !== false) {
          return;
        }

        this.errors = store.getState().specificLocations.errors;
        if (this.errors && this.errors.point) {
          fireEvent(this, 'toast', {
            text: getTranslation('SELECT_CORRECT_LOCATION')
          });
        }
        if (this.errors && Object.keys(this.errors).length) {
          return;
        }

        this.dialogOpened = false;
        fireEvent(this, 'dialog-closed', {confirmed: true});
      }, false)
    );

    this.currentWorkspaceUnsubscribe = store.subscribe(
      currentWorkspaceSelector((workspace: Workspace | undefined) => {
        if (!workspace) {
          return;
        }
        this.defaultMapCenter = (workspace.point && workspace.point.coordinates) || DEFAULT_COORDINATES;
      })
    );

    this.activeLanguageUnsubscribe = store.subscribe(
      activeLanguageSelector(() => {
        this.statusOptions = applyDropdownTranslation(STATUS_OPTIONS);
      })
    );
  }

  set dialogData(data: SitesPopupData) {
    if (!data) {
      return;
    }
    const {model, sitesObjects}: SitesPopupData = data;

    this.sitesObjects = sitesObjects || [];
    if (!model) {
      return;
    }
    this.data = model;
  }

  render(): TemplateResult {
    return template.call(this);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.updateSiteLocationUnsubscribe();
    this.currentWorkspaceUnsubscribe();
    this.activeLanguageUnsubscribe();
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  saveSite(): void {
    if (!validateRequiredFields(this)) {
      return;
    }
    this.savingInProcess = true;
    const {lat, lng}: L.LatLng =
      (this.MapHelper.dynamicMarker && this.MapHelper.dynamicMarker.getLatLng()) || ({} as L.LatLng);
    if (lat && lng) {
      this.editedData.point = {
        type: 'Point',
        coordinates: [this.toPrecision(lng), this.toPrecision(lat)]
      };
    }

    const site: EditedSite =
      this.originalData !== null
        ? getDifference<EditedSite>(this.originalData, this.editedData, {toRequest: true})
        : this.editedData;
    const isEmpty = !Object.keys(site).length;

    if (isEmpty) {
      this.dialogOpened = false;
      this.onClose();
    } else if (this.originalData && this.originalData.id) {
      store.dispatch<AsyncEffect>(updateSiteLocation(this.editedData.id as number, site));
    } else {
      store.dispatch<AsyncEffect>(addSiteLocation(this.editedData as Site));
    }
  }

  setStatusValue(active: boolean): 1 | 0 {
    return active ? 1 : 0;
  }

  async mapInitialization() {
    let mapWasMissing = false;
    if (!this.MapHelper.map) {
      this.MapHelper.initMap(this.mapElement);
      mapWasMissing = true;
    }

    this.MapHelper.waitForMapToLoad().then(() => {
      if (mapWasMissing) {
        this.MapHelper.map!.on('click', (clickEvent: L.LeafletEvent) => {
          const {lat, lng} = (clickEvent as L.LeafletMouseEvent).latlng;
          this.MapHelper.changeDMLocation([lat, lng]);
          this.setCoordsString();
        });
      }

      this.renderMarkers();
      const id: number | null = (this.editedData && this.editedData.id) || null;
      if (id) {
        const site = (this.MapHelper.staticMarkers || []).find((marker: IMarker) => marker.staticData.id === id);
        this.MapHelper.dynamicMarker = site || null;
        this.setCoordsString();
      }
      this.setMapView();
    });
  }

  updateLatLng(value: number, param: 'latitude' | 'longitude'): void {
    if (value) {
      this[param] = value;
      this.setLatLngWithDelay();
    }
  }

  updateMapPoint(): void {
    if (this.MapHelper.dynamicMarker && this.latitude && this.longitude) {
      this.MapHelper.dynamicMarker.setLatLng([this.latitude, this.longitude]);
      this.MapHelper.dynamicMarker.openPopup();
    }
  }

  private toPrecision(num: number, precision = 5): number {
    if (!num || typeof num !== 'number') {
      return num;
    }
    return Number(num.toFixed(precision));
  }

  private renderMarkers(): void {
    if (!this.MapHelper.map || !this.sitesObjects) {
      return;
    }
    const sitesCoords: MarkerDataObj[] = this.sitesObjects.map((site: Site) => {
      const coords: L.LatLngTuple = [...site.point.coordinates].reverse() as L.LatLngTuple;
      return {coords, staticData: site, popup: site.name};
    }) as any;
    this.MapHelper.addCluster(sitesCoords);
  }

  private setMapView(): void {
    const coords: L.LatLngTuple =
      (this.editedData && this.editedData.point && this.editedData.point.coordinates) || this.defaultMapCenter;
    const reversedCoords: L.LatLngTuple = [...coords].reverse() as L.LatLngTuple;
    const zoom: number = coords === this.defaultMapCenter ? 8 : 15;
    this.MapHelper.map!.setView(reversedCoords, zoom);
    if (this.MapHelper.dynamicMarker) {
      this.MapHelper.dynamicMarker.openPopup();
    }
  }

  private setCoordsString(): void {
    if (!this.MapHelper.dynamicMarker) {
      this.currentCoords = null;
    } else {
      const {lat, lng} = this.MapHelper.dynamicMarker.getLatLng();
      this.latitude = this.toPrecision(lat);
      this.longitude = this.toPrecision(lng);
      this.currentCoords = `${translate('MAIN.LATITUDE')} ${lat}` + `     ${translate('MAIN.LONGITUDE')} ${lng}`;
    }
  }

  static get styles(): CSSResultArray {
    return [
      SharedStyles,
      pageLayoutStyles,
      layoutStyles,
      CardStyles,
      leafletStyles,
      SitesTabStyles,
      css`
        .selected-sites-label {
          padding: 13px 12px;
          color: #858585;
          font-size: var(--etools-font-size-16, 16px);
          display: flex;
          align-content: center;
          align-items: flex-end;
        }
      `
    ];
  }
}
