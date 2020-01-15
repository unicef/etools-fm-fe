import {html, TemplateResult} from 'lit-element';
import {PartnershipTab} from './partnership-tab';
import '../../../../../common/progressbar/proportional-progress-bar';
import '@unicef-polymer/etools-dropdown';
import {repeat} from 'lit-html/directives/repeat';
import {translate} from '../../../../../../localization/localisation';

export function template(this: PartnershipTab): TemplateResult {
  return html`
    <div class="partner-coverage">
      <etools-loading
        ?active="${this.loading}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="partner-coverage__header">
        <!--  Progress bar legend  -->
        <div class="partner-coverage__header-item">
          <div class="coverage-legend">
            <div class="coverage-legend__mark coverage-legend__mark-completed"></div>
            <label class="coverage-legend__label">Completed Tasks</label>
          </div>
          <div class="coverage-legend">
            <div class="coverage-legend__mark"><div class="coverage-legend__mark-required"></div></div>
            <label class="coverage-legend__label">Minimum Required Programmatic Visits</label>
          </div>
        </div>

        <!--  Sorting  -->
        <div class="partner-coverage__header-item sorting-dropdown">
          <etools-dropdown
            .selected="${this.selectedSortingOption}"
            label="Sort by"
            .options="${this.sortingOptions}"
            option-label="display_name"
            option-value="value"
            trigger-value-change-event
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.onSelectionChange(detail.selectedItem.value)}"
            hide-search
            allow-outside-scroll
          >
          </etools-dropdown>
        </div>
      </div>

      <!--  Progress bars list  -->
      ${repeat(
        this.partnersCoverage.sort((a: PartnersCoverage, b: PartnersCoverage) => this.sortProgressBars(a, b)),
        (item: PartnersCoverage) => item.id,
        (item: PartnersCoverage) => html`
          <div class="progressbar-container">
            <div class="progressbar-container__header ">${item.name}</div>
            <proportional-progress-bar
              .completed="${item.completed_visits}"
              .planned="${item.planned_visits}"
              .minRequired="${item.minimum_required_visits}"
              .daysSinceLastVisit="${item.days_since_visit}"
              .minRequiredLabelValue="Minimum Required ${item.minimum_required_visits}"
              .daysSinceLastVisitLabelValue="Days Since Last Visit ${item.days_since_visit}"
            >
            </proportional-progress-bar>
          </div>
        `
      )}
    </div>
  `;
}
