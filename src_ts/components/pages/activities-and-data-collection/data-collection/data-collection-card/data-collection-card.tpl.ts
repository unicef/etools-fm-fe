import {html, TemplateResult} from 'lit-element';
import {DataCollectionCard} from './data-collection-card';
import {InputStyles} from '../../../../styles/input-styles';
import {store} from '../../../../../redux/store';
import {SetEditedDCChecklistCard} from '../../../../../redux/actions/data-collection.actions';
import {translate} from '../../../../../localization/localisation';
import '../../../../common/layout/etools-card';
import '@polymer/paper-input/paper-textarea';
import '@unicef-polymer/etools-loading';

export function template(this: DataCollectionCard): TemplateResult {
  return html`
    ${InputStyles}
    <etools-card
      card-title="${this.tabName}"
      is-collapsible
      ?is-editable="${!this.readonly}"
      ?edit="${this.isEditMode && !this.updateInProcess}"
      ?hide-edit-button="${this.blockEdit}"
      @start-edit="${() => store.dispatch(new SetEditedDCChecklistCard(this.cardId))}"
      @save="${() => this.saveChanges()}"
      @cancel="${() => this.cancelEdit()}"
    >
      <div slot="content">
        <!-- Spinner -->
        <etools-loading
          ?active="${this.updateInProcess}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>

        <!-- Overall Finding field. Is Hidden if overallInfo property is null -->
        ${this.overallInfo
          ? html`
              <div class="overall-finding">
                <paper-textarea
                  id="details-input"
                  class="without-border"
                  .value="${(this.overallInfo && this.overallInfo.narrative_finding) || ''}"
                  label="Overall finding"
                  ?disabled="${!this.isEditMode}"
                  placeholder="${this.isEditMode ? 'Enter Overall finding' : '-'}"
                  @value-changed="${({detail}: CustomEvent) =>
                    this.updateOverallFinding({narrative_finding: detail.value})}"
                ></paper-textarea>
              </div>
            `
          : ''}

        <!-- Findings table with different findings types -->
        ${this.findings.map((finding: DataCollectionFinding) => this.getFindingTemplate(finding))}
      </div>
    </etools-card>
  `;
}
