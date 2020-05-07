import {GeographicCoverageComponent} from './geographic-coverage';
import {html, TemplateResult} from 'lit-element';
import '@unicef-polymer/etools-dropdown';
import {translate} from 'lit-translate';

export function template(this: GeographicCoverageComponent): TemplateResult {
  return html`
    <section class="elevation page-content card-container monitoring-activity__geographic-coverage" elevation="1">
      <div class="card-title-box with-bottom-line">
        <div class="card-title">${translate('ANALYZE.MONITORING_TAB.GEOGRAPHIC_COVERAGE.TITLE')}</div>
      </div>
      <div>
        <div class="geographic-coverage">
          <div class="geographic-coverage__header">
            <!--  Map legend  -->
            <div class="geographic-coverage__header-item">
              <label>${translate('ANALYZE.MONITORING_TAB.GEOGRAPHIC_COVERAGE.COMPLETED_VISITS')}</label>
              <div class="coverage-legend-container">
                <div class="coverage-legend">
                  <div class="coverage-legend__mark coverage-legend__mark-no-visits"></div>
                  <label class="coverage-legend__label"
                    >${translate('ANALYZE.MONITORING_TAB.GEOGRAPHIC_COVERAGE.NO_VISITS')}</label
                  >
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
              <etools-loading
                ?active="${this.loading}"
                loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
              ></etools-loading>
              <etools-dropdown-multi
                .selectedValues="${this.selectedOptions}"
                label="Filter By Section"
                .options="${this.sections}"
                option-label="name"
                option-value="id"
                trigger-value-change-event
                @etools-selected-items-changed="${({detail}: CustomEvent) =>
                  this.onSelectionChange(detail.selectedItems)}"
                @iron-overlay-closed="${() => this.onDropdownClose()}"
                @remove-selected-item="${(event: Event) => this.onRemoveSelectedItem(event)}"
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
