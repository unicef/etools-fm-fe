import {GeographicCoverageComponent} from './geographic-coverage';
import {html, TemplateResult} from 'lit-element';

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
            <div class="geographic-coverage__header-item sorting-dropdown">
              <etools-dropdown-multi
                .selectedValues="${this.selectedSortingOptions}"
                label="Filter By Section"
                .options="${this.sections}"
                option-label="name"
                option-value="id"
                trigger-value-change-event
                @etools-selected-items-changed="${() => this.onSelectionChange()}"
                hide-search
                allow-outside-scroll
              >
              </etools-dropdown-multi>
            </div>
          </div>
          <!--  Map element  -->
          <div id="geomap"></div>
        </div>
      </div>
    </section>
  `;
}
