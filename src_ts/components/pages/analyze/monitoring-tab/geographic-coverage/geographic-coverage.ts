import {CSSResult, LitElement, PropertyValues, TemplateResult} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';
import {template} from './geographic-coverage.tpl';
import {elevationStyles} from '../../../../styles/elevation-styles';
import {SharedStyles} from '../../../../styles/shared-styles';
import {pageLayoutStyles} from '../../../../styles/page-layout-styles';
import {FlexLayoutClasses} from '../../../../styles/flex-layout-classes';
import {CardStyles} from '../../../../styles/card-styles';
import {MapHelper} from '../../../../common/map-mixin';
import {LatLngTuple, Polygon, PolylineOptions} from 'leaflet';
import {leafletStyles} from '../../../../styles/leaflet-styles';
import {Unsubscribe} from 'redux';
import {store} from '../../../../../redux/store';
import {loadGeographicCoverageBySection} from '../../../../../redux/effects/monitoring-activity.effects';
import {SectionsMixin} from '../../../../common/mixins/sections-mixin';
import {geographicCoverageSelector} from '../../../../../redux/selectors/monitoring-activities.selectors';
import {geographicCoverageStyles} from './geographic-coverage.styles';
import {reverseNestedArray} from '@unicef-polymer/etools-utils/dist/array.util';
import {equals, clone} from 'ramda';

const DEFAULT_COORDINATES: LatLngTuple = [-0.09, 51.505].reverse() as LatLngTuple;

@customElement('geographic-coverage')
export class GeographicCoverageComponent extends SectionsMixin(LitElement) {
  @property() selectedOptions: string[] = [];
  @property() loading = false;
  @query('#geomap') private mapElement!: HTMLElement;
  lastDispatchedSelectedOptions: string[] = [];
  private polygons: Polygon[] = [];
  private mapHelper!: MapHelper;
  private geographicCoverageUnsubscribe!: Unsubscribe;

  private _invalidMapSize = false;
  private mapTarget: LatLngTuple = DEFAULT_COORDINATES;

  @property({type: Array})
  get invalidMapSize(): boolean {
    return this._invalidMapSize;
  }
  set invalidMapSize(_resizeMap: boolean) {
    this.resizeMap();
  }

  render(): TemplateResult {
    return template.call(this);
  }

  connectedCallback(): void {
    super.connectedCallback();
    this.dispatchGeographicCoverageLoading();
    this.geographicCoverageUnsubscribe = store.subscribe(
      geographicCoverageSelector((geographicCoverage: GeographicCoverage[]) => {
        this.clearMap();
        geographicCoverage = clone(geographicCoverage);
        geographicCoverage.forEach((item: GeographicCoverage) => this.drawPolygons(item));
        if (geographicCoverage.length) {
          let viewCoordinates: any = geographicCoverage[0].geom.coordinates;
          // coordinates are nested arrays, navigate to last level to get valid Lat and Lng
          while (Array.isArray(viewCoordinates) && viewCoordinates[0] && Array.isArray(viewCoordinates[0][0])) {
            viewCoordinates = viewCoordinates[0];
          }
          this.mapTarget = viewCoordinates[0] || DEFAULT_COORDINATES;
          this.mapHelper.map!.setView(this.mapTarget, 6);
          this.mapHelper.map!.invalidateSize();
        }
        this.loading = false;
      }, false)
    );
  }

  dispatchGeographicCoverageLoading(): void {
    this.loading = true;
    const argument: string = this.selectedOptions.length ? `?sections__in=${this.selectedOptions.join(',')}` : '';
    store.dispatch<AsyncEffect>(loadGeographicCoverageBySection(argument));
  }

  onSelectionChange(selectedItems: EtoolsSection[]): void {
    const selectedSections: string[] = selectedItems.map((item: EtoolsSection) => item.id);
    // prevents infinite event triggering loop on items removal
    if (!equals(this.selectedOptions, selectedSections)) {
      this.selectedOptions = selectedSections;
    }
  }

  onDropdownClose(): void {
    const freshOptions: string[] = this.selectedOptions.slice().sort();
    if (freshOptions.toString() !== this.lastDispatchedSelectedOptions.sort().toString()) {
      this.dispatchGeographicCoverageLoading();
      this.lastDispatchedSelectedOptions = this.selectedOptions.slice();
    }
  }

  onRemoveSelectedItems(event: Event): void {
    event.stopImmediatePropagation();
    this.dispatchGeographicCoverageLoading();
  }

  getPolygonOptions(geographicCoverageItem: GeographicCoverage): PolylineOptions {
    let color = 'grey';
    if (geographicCoverageItem.completed_visits == 0) {
      color = 'var(--mark-no-visits-color)';
    } else if (1 <= geographicCoverageItem.completed_visits && geographicCoverageItem.completed_visits <= 5) {
      color = 'var(--mark-one-five-color)';
    } else if (6 <= geographicCoverageItem.completed_visits && geographicCoverageItem.completed_visits <= 10) {
      color = 'var(--mark-six-ten)';
    } else if (geographicCoverageItem.completed_visits >= 11) {
      color = 'var(--mark-eleven)';
    } else {
      //TODO throw an error instead?
      console.error(
        'Geographic coverage: wrong completed_visits count: ',
        JSON.stringify(geographicCoverageItem.completed_visits)
      );
    }
    return {
      color: color,
      stroke: false,
      fillOpacity: 0.5,
      pane: 'tilePane'
    };
  }

  initMap(): void {
    this.mapHelper = new MapHelper();
    this.mapHelper.initMap(this.mapElement);
    const zoom = 6;
    this.mapHelper.map!.setView(DEFAULT_COORDINATES, zoom);
  }

  resizeMap(): void {
    if (this.mapHelper) {
      // wait for layout to change
      setTimeout(
        () => {
          this.mapHelper.map!.invalidateSize();
          const zoom = 6;
          this.mapHelper.map!.setView(this.mapTarget, zoom);
        },
        500,
        this
      );
    }
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.geographicCoverageUnsubscribe();
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.initMap();
  }

  private drawPolygons(location: GeographicCoverage): void {
    const polygonOptions: PolylineOptions = this.getPolygonOptions(location);
    const reversedCoordinates: CoordinatesArray[] = this.getReversedCoordinates(location);
    const polygon: Polygon = L.polygon(reversedCoordinates, polygonOptions);
    polygon.addTo(this.mapHelper.map!);
    this.polygons.push(polygon);
  }

  private clearMap(): void {
    this.polygons.forEach((polygon: Polygon) => polygon.removeFrom(this.mapHelper.map!));
    this.polygons.length = 0;
  }

  private getReversedCoordinates(location: GeographicCoverage): CoordinatesArray[] {
    return reverseNestedArray(location.geom.coordinates || []);
  }

  static get styles(): CSSResult[] {
    return [
      elevationStyles,
      SharedStyles,
      pageLayoutStyles,
      FlexLayoutClasses,
      CardStyles,
      geographicCoverageStyles,
      leafletStyles
    ];
  }
}
