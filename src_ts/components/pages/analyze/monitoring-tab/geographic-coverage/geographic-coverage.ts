import {css, CSSResult, customElement, LitElement, property, PropertyValues, query, TemplateResult} from 'lit-element';
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
import {geographicCoverageSelector} from '../../../../../redux/selectors/geographic-coverage.selectors';
import {SectionsMixin} from '../../../../common/mixins/sections-mixin';

const DEFAULT_COORDINATES: LatLngTuple = [-0.09, 51.505].reverse() as LatLngTuple;

@customElement('geographic-coverage')
export class GeographicCoverageComponent extends SectionsMixin(LitElement) {
  @property() selectedSortingOptions: number[] = [];
  @query('#geomap') private mapElement!: HTMLElement;
  private polygons: Polygon[] = [];
  private mapHelper!: MapHelper;
  private readonly geographicCoverageUnsubscribe!: Unsubscribe;

  constructor() {
    super();

    this.geographicCoverageUnsubscribe = store.subscribe(
      geographicCoverageSelector((geographicCoverage: GeographicCoverage[]) => {
        this.clearMap();
        geographicCoverage.forEach((item: GeographicCoverage) => this.drawPolygons(item));
        if (geographicCoverage.length) {
          const target: LatLngTuple = this.getReversedCoordinates(geographicCoverage[0])[0] || DEFAULT_COORDINATES;
          this.mapHelper.map!.setView(target, 6);
        }
      })
    );
  }

  render(): TemplateResult {
    return template.call(this);
  }

  onSelectionChange(): void {
    if (this.selectedSortingOptions.length) {
      store.dispatch<AsyncEffect>(loadGeographicCoverageBySection(this.selectedSortingOptions.join(',')));
    }
  }

  getPolygonOptions(geographicCoverageItem: GeographicCoverage): PolylineOptions {
    let color: string = 'grey';
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
      fillOpacity: 0.8,
      pane: 'tilePane'
    };
  }

  initMap(): void {
    this.mapHelper = new MapHelper();
    this.mapHelper.initMap(this.mapElement);
    const zoom: number = 6;
    this.mapHelper.map!.setView(DEFAULT_COORDINATES, zoom);
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
    return (location.geom.coordinates || [])
      .flat()
      .flat()
      .map((coordinate: CoordinatesArray) => [...coordinate].reverse() as CoordinatesArray);
  }

  static get styles(): CSSResult[] {
    const geographicCoverageStyles: CSSResult = css`
      :host {
        --mark-no-visits-color: #ddf1bf;
        --mark-one-five-color: #9ed6b9;
        --mark-six-ten: #3f9bbc;
        --mark-eleven: #273891;
      }
      #geomap {
        min-height: 400px;
        z-index: 0;
      }
      .monitoring-activity__geographic-coverage {
      }
      .geographic-coverage {
        display: flex;
        flex-direction: column;
      }
      .geographic-coverage__header {
        display: flex;
        flex-wrap: wrap;
        padding: 2%;
        justify-content: space-between;
      }
      .geographic-coverage__header-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-basis: 50%;
      }
      .sorting-dropdown {
        flex-basis: 30%;
      }
      .coverage-legend-container {
        display: flex;
        flex-wrap: wrap;
        margin-top: 2%;
      }
      .coverage-legend {
        display: flex;
        flex-basis: 40%;
        margin: 1%;
      }
      .coverage-legend__mark {
        min-width: 17px;
        min-height: 17px;
        max-width: 17px;
        max-height: 17px;
        margin-right: 2%;
        display: flex;
        justify-content: center;
      }
      .coverage-legend__mark-no-visits {
        background-color: var(--mark-no-visits-color);
      }
      .coverage-legend__mark-one-five {
        background-color: var(--mark-one-five-color);
      }
      .coverage-legend__mark-six-ten {
        background-color: var(--mark-six-ten);
      }
      .coverage-legend__mark-eleven {
        background-color: var(--mark-eleven);
      }
      .coverage-legend__label {
      }
    `;
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
