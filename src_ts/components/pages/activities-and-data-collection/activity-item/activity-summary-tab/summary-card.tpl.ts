import {html, TemplateResult} from 'lit';
import {InputStyles} from '../../../../styles/input-styles';
import '../../../../common/layout/etools-card';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading';
import {translate} from 'lit-translate';
import {SummaryCard} from './summary-card';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';

export function template(this: SummaryCard): TemplateResult {
  return html`
    ${InputStyles}
    <style>
      ${FormBuilderCardStyles}
    </style>
    <etools-card
      card-title="${this.tabName}"
      is-collapsible
      ?is-editable="${!this.readonly}"
      ?edit="${this.isEditMode && !this.updateInProcess}"
      ?hide-edit-button="${this.blockEdit}"
      @start-edit="${() => {
        fireEvent(this, 'child-in-edit-mode-changed', {inEditMode: true});
        this.isEditMode = true;
      }}"
      @save="${() => this.saveChanges()}"
      @cancel="${() => this.cancelEdit()}"
    >
      <!-- Open Attachments popup button -->
      <div slot="actions" class="layout-horizontal align-items-center">${this.getAdditionalButtons()}</div>

      <div slot="content">
        <!-- Spinner -->
        <etools-loading
          ?active="${this.updateInProcess}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>

        <!-- Overall Finding field. Is Hidden if OverallInfo property is null -->
        ${this.getOverallFindingTemplate()}

        <!-- Findings table with different findings types -->
        ${this.findings.map((finding: SummaryFinding) => this.getFindingTemplate(finding))}
      </div>
    </etools-card>
  `;
}
