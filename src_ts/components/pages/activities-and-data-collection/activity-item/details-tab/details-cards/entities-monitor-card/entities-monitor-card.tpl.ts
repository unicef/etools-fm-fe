import {html, TemplateResult} from 'lit-element';
import {EntitiesMonitorCard} from './entities-monitor-card';
import {CARD_NAME} from './entities-monitor-card';
import {translate} from 'lit-translate';

const ELEMENT_FIELDS: (keyof IActivityDetails)[] = ['cp_outputs', 'partners', 'interventions'];

export function template(this: EntitiesMonitorCard): TemplateResult {
  return html`
    <etools-card
      card-title="${translate('ACTIVITY_DETAILS.ENTRIES_TO_MONITOR')}"
      ?is-editable="${this.havePossibilityToEditCard(CARD_NAME, ELEMENT_FIELDS)}"
      ?edit="${this.isEditMode}"
      @start-edit="${() => this.startEdit()}"
      @save="${() => this.save()}"
      @cancel="${() => this.cancel()}"
    >
      <div class="card-content" slot="content">
        <!--   Spinner for loading data   -->
        <etools-loading
          ?active="${this.isLoad}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>

        <!--   Spinner for updating data   -->
        <etools-loading
          ?active="${this.isUpdate}"
          loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
        ></etools-loading>

        <div class="layout horizontal">
          <!--    Partners List    -->
          <entries-list
            class="entries-list"
            .nameList="${translate('ACTIVITY_DETAILS.PARTNERS')}"
            .formatItem="${(item: EtoolsPartner) => item.name}"
            .items="${this.activityPartners}"
            ?is-readonly="${!this.isEditMode}"
            @add-entry="${() => this.openAddPartner()}"
            @remove-entry="${({detail}: CustomEvent) =>
              this.removeItem<EtoolsPartner>(detail.id, 'partners', 'activityPartners')}"
          >
          </entries-list>

          <!--    CP Outputs List    -->
          <entries-list
            class="entries-list"
            .nameList="${translate('ACTIVITY_DETAILS.CP_OUTPUTS')}"
            .formatItem="${(item: EtoolsCpOutput) => item.name}"
            .items="${this.activityCpOutputs}"
            ?is-readonly="${!this.isEditMode}"
            @add-entry="${() => this.openAddCpOutput()}"
            @remove-entry="${({detail}: CustomEvent) =>
              this.removeItem<EtoolsCpOutput>(detail.id, 'cp_outputs', 'activityCpOutputs')}"
          >
          </entries-list>

          <!--    Interventions List    -->
          <entries-list
            class="entries-list"
            .nameList="${translate('ACTIVITY_DETAILS.INTERVENTIONS')}"
            .formatItem="${(item: EtoolsIntervention) => item.title}"
            .items="${this.activityInterventions}"
            ?is-readonly="${!this.isEditMode}"
            @add-entry="${() => this.openAddIntervention()}"
            @remove-entry="${({detail}: CustomEvent) =>
              this.removeItem<EtoolsIntervention>(detail.id, 'interventions', 'activityInterventions')}"
          >
          </entries-list>
        </div>
      </div>
    </etools-card>
  `;
}
