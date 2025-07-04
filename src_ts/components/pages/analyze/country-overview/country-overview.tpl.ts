import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown-multi';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-collapse/etools-collapse';
import {html, TemplateResult} from 'lit';
import {CoOverviewTabComponent} from './country-overview';
import {InputStyles} from '../../../styles/input-styles';
import {repeat} from 'lit/directives/repeat.js';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import './cp-details-item/cp-details-item';

export function template(this: CoOverviewTabComponent): TemplateResult {
  return html`
    ${InputStyles}
    <section class="elevation page-content layout-horizontal" elevation="1">
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
          <div class="card-title-box with-bottom-line layout-horizontal">
            <etools-icon
              name="${this.queryParams && this.queryParams.cp_output === cpOutput.id ? 'expand-less' : 'expand-more'}"
              @click="${() => this.toggleDetails(cpOutput.id)}"
            ></etools-icon>
            <div class="card-title full-report">${cpOutput.name}</div>
            <a href="${`/apd/action-points/list?cp_output=${cpOutput.id}`}" target="_blank">
              <etools-icon name="flag" class="flag-icon"></etools-icon>
            </a>
          </div>
          <etools-collapse ?opened="${this.queryParams && String(this.queryParams.cp_output) === String(cpOutput.id)}">
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
          </etools-collapse>
        </section>
      `
    )}
  `;
}
