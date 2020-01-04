import {html, TemplateResult} from 'lit-element';
import {DataCollectionCard} from './data-collection-card';
import {InputStyles} from '../../../../styles/input-styles';
import {store} from '../../../../../redux/store';
import {SetEditedFindingsCard} from '../../../../../redux/actions/findings-components.actions';
import '../../../../common/layout/etools-card';
import '@polymer/paper-input/paper-textarea';
import '@unicef-polymer/etools-loading';
import {translate} from 'lit-translate';

export function template(this: DataCollectionCard): TemplateResult {
  return html`
    ${InputStyles}
    <etools-card
      card-title="${this.tabName}"
      is-collapsible
      ?is-editable="${!this.readonly}"
      ?edit="${this.isEditMode && !this.updateInProcess}"
      ?hide-edit-button="${this.blockEdit}"
      @start-edit="${() => store.dispatch(new SetEditedFindingsCard(this.cardId))}"
      @save="${() => this.saveChanges()}"
      @cancel="${() => this.cancelEdit()}"
    >
      <!-- Open Attachments popup button -->
      <div slot="actions" class="layout horizontal center">
        ${this.getAdditionalButtons()}
      </div>

      <div slot="content">
        <!-- Spinner -->
        <etools-loading
          ?active="${this.updateInProcess}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>

        <!-- Overall Finding field. Is Hidden if OverallInfo property is null -->
        ${this.getOverallFindingTemplate()}

        <!-- Findings table with different findings types -->
        ${this.findings.map((finding: DataCollectionFinding) => this.getFindingTemplate(finding))}
      </div>
    </etools-card>
  `;
}
