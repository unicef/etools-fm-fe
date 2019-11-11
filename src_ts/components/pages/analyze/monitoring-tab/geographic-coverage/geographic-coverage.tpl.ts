import {GeographicCoverageComponent} from './geographic-coverage';
import {html, TemplateResult} from 'lit-element';
import '../../../../common/location-widget/location-widget';

export function template(this: GeographicCoverageComponent): TemplateResult {
  return html`
    <section class="elevation page-content card-container monitoring-activity__geographic-coverage" elevation="1">
      <div class="card-title-box with-bottom-line">
        <div class="card-title">Geographic coverage</div>
      </div>
      <div>
        <div class="geographic-coverage">
          <div class="geographic-coverage__header">
            <!--  Map legend  -->
            <div class="geographic-coverage__header-item">
              <label>Completed visits</label>
              <div class="coverage-legend-container">
                <div class="coverage-legend">
                  <div class="coverage-legend__mark coverage-legend__mark-no-visits"></div>
                  <label class="coverage-legend__label">No visits</label>
                </div>
                <div class="coverage-legend">
                  <div class="coverage-legend__mark coverage-legend__mark-one-five"></div>
                  <label class="coverage-legend__label">1-5</label>
                </div>
                <div class="coverage-legend">
                  <div class="coverage-legend__mark coverage-legend__mark-six-ten"></div>
                  <label class="coverage-legend__label">6-10</label>
                </div>
                <div class="coverage-legend">
                  <div class="coverage-legend__mark coverage-legend__mark-eleven"></div>
                  <label class="coverage-legend__label">11+</label>
                </div>
              </div>
            </div>
            <!--  Sorting  -->
            <div class="geographic-coverage__header-item">
              <etools-dropdown-multi
                .selectedValues="${this.selectedSortingOptions}"
                label="Filter By Section"
                .options="${this.sortingOptions}"
                option-label="display_name"
                option-value="value"
                trigger-value-change-event
                @etools-selected-items-changed="${({detail}: CustomEvent) =>
                  this.onSelectionChange(detail.selectedItems)}"
                hide-search
                allow-outside-scroll
              >
              </etools-dropdown-multi>
            </div>
          </div>
          <div id="geomap"></div>
        </div>
      </div>
    </section>
  `;
}
