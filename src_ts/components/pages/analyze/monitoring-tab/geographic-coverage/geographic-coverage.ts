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
import {loadStaticData} from '../../../../../redux/effects/load-static-data.effect';
import {SECTIONS} from '../../../../../endpoints/endpoints-list';
import {sectionsDataSelector} from '../../../../../redux/selectors/static-data.selectors';

const DEFAULT_COORDINATES: LatLngTuple = [-0.09, 51.505];

@customElement('geographic-coverage')
export class GeographicCoverageComponent extends LitElement {
  @property() selectedSortingOptions: number[] = [];
  @property() sortingOptions: DefaultDropdownOption<number>[] = [];
  @query('#geomap') private mapElement!: HTMLElement;
  private polygon: Polygon | null = null;
  private MapHelper!: MapHelper;
  private readonly geographicCoverageUnsubscribe!: Unsubscribe;
  private readonly sectionsUnsubscribe!: Unsubscribe;

  constructor() {
    super();
    store.dispatch<AsyncEffect>(loadStaticData(SECTIONS));
    this.sectionsUnsubscribe = store.subscribe(
      sectionsDataSelector((sections: EtoolsSection[] | undefined) => {
        this.sortingOptions = sections
          ? sections.map(
              (item: EtoolsSection): DefaultDropdownOption => {
                return {display_name: item.name, value: JSON.parse(item.id)};
              }
            )
          : [];

        if (this.sortingOptions.length) {
          this.onSelectionChange([this.sortingOptions[0]]);
        }
      })
    );

    this.geographicCoverageUnsubscribe = store.subscribe(
      geographicCoverageSelector((geographicCoverage: GeographicCoverage[]) => {
        geographicCoverage.forEach((item: GeographicCoverage) => this.drawPolygons(item, this.getPolygonOptions(item)));
        if (geographicCoverage.length) {
          this.MapHelper.map!.flyToBounds(this.getReversedCoordinates(geographicCoverage[0]), {maxZoom: 6});
        }
      })
    );
  }

  render(): TemplateResult {
    return template.call(this);
  }

  onSelectionChange(selectedItems: DefaultDropdownOption<number>[]): void {
    this.selectedSortingOptions.splice(
      0,
      this.selectedSortingOptions.length,
      ...selectedItems.map((item: DefaultDropdownOption) => item.value)
    );
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
    this.MapHelper = new MapHelper();
    this.MapHelper.initMap(this.mapElement);
    const reversedCoords: LatLngTuple = DEFAULT_COORDINATES.reverse() as LatLngTuple;
    const zoom: number = 6;
    this.MapHelper.map!.setView(reversedCoords, zoom);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.geographicCoverageUnsubscribe();
    this.sectionsUnsubscribe();
  }

  protected firstUpdated(_changedProperties: PropertyValues): void {
    super.firstUpdated(_changedProperties);
    this.initMap();
  }

  private drawPolygons(location: GeographicCoverage, polygonOptions: PolylineOptions): void {
    const reversedCoordinates: CoordinatesArray[] = this.getReversedCoordinates(location);
    this.polygon = L.polygon(reversedCoordinates, polygonOptions);
    this.polygon.addTo(this.MapHelper.map!);
  }

  private getReversedCoordinates(location: GeographicCoverage): CoordinatesArray[] {
    return (location.geom.coordinates || [])
      .flat()
      .flat()
      .map((coordinate: CoordinatesArray) => [...coordinate].reverse() as CoordinatesArray);
  }

  static get styles(): CSSResult[] {
    const monitoringTabStyles: CSSResult = css`
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
      }
      .geographic-coverage__header-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-basis: 50%;
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
      monitoringTabStyles,
      leafletStyles
    ];
  }
}
