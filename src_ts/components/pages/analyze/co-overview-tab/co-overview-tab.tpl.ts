import '@unicef-polymer/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import {html, TemplateResult} from 'lit';
import {CoOverviewTabComponent} from './co-overview-tab';
import {InputStyles} from '../../../styles/input-styles';
import {repeat} from 'lit/directives/repeat.js';
import {translate} from 'lit-translate';

export function template(this: CoOverviewTabComponent): TemplateResult {
  return html`
    ${InputStyles}
    <section class="elevation page-content layout horizontal" elevation="1">
      <etools-loading
        ?active="${this.isLoad}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <etools-dropdown
        .selected="${(this.queryParams && this.queryParams.cp_outcome) || undefined}"
        label="${translate('CO_OVERVIEW.CP_OUTCOME')}"
        placeholder="${translate('CO_OVERVIEW.PLACEHOLDER.CP_OUTCOME')}"
        .options="${this.cpOutcomes}"
        option-label="name"
        option-value="id"
        @etools-selected-item-changed="${({detail}: CustomEvent) => this.filterValueChanged(detail.selectedItem)}"
        trigger-value-change-event
        hide-search
        allow-outside-scroll
      ></etools-dropdown>
    </section>

    ${repeat(
      this.filteredCpOutputs,
      (cpOutput: EtoolsCpOutput) => cpOutput.id,
      (cpOutput: EtoolsCpOutput) => html`
        <section class="elevation page-content card-container" elevation="1">
          <div class="card-title-box with-bottom-line layout horizontal">
            <iron-icon
              icon="${this.queryParams && this.queryParams.cp_output === cpOutput.id ? 'expand-less' : 'expand-more'}"
              @tap="${() => this.toggleDetails(cpOutput.id)}"
            ></iron-icon>
            <div class="card-title full-report">${cpOutput.name}</div>
            <a href="${`/apd/action-points/list?cp_output=${cpOutput.id}`}" target="_blank"
              ><iron-icon icon="flag" class="flag-icon"></iron-icon
            ></a>
          </div>
          <iron-collapse ?opened="${this.queryParams && String(this.queryParams.cp_output) === String(cpOutput.id)}">
            ${this.fullReports[cpOutput.id]
              ? html`
                  <cp-details-item
                    .cpItem="${cpOutput}"
                    .fullReport="${this.fullReports[cpOutput.id]}"
                    .isUnicefUser="${this.isUnicefUser}"
                  ></cp-details-item>
                `
              : html`
                  <div class="spinner">
                    <etools-loading active></etools-loading>
                  </div>
                `}
          </iron-collapse>
        </section>
      `
    )}
  `;
}
