import '@unicef-polymer/etools-data-table/etools-data-table.js';
import '@polymer/paper-checkbox';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading';
import '../../../../../common/layout/etools-card';
import {html, TemplateResult} from 'lit';
import {ChecklistSelectionTable} from './checklist-selection-table';
import {PaperCheckboxElement} from '@polymer/paper-checkbox/paper-checkbox';
import {ROOT_PATH} from '../../../../../../config/config';
import {InputStyles} from '../../../../../styles/input-styles';
import {translate} from 'lit-translate';

export function template(this: ChecklistSelectionTable): TemplateResult {
  return html`
    ${InputStyles}
    <etools-card
      card-title="${this.tableTitle}"
      is-collapsible
      ?is-editable="${!this.readonly}"
      ?edit="${this.isEditMode}"
      ?hide-edit-button="${this.blockEdit}"
      @start-edit="${() => this.enableEditMode()}"
      @save="${() => this.saveChanges()}"
      @cancel="${() => this.cancelEdit()}"
    >
      <!-- Table -->
      <div slot="content" class="table-container">
        <!-- Spinner -->
        <etools-loading
          ?active="${this.loadingInProcess}"
          loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
        ></etools-loading>

        <!-- Input for Specific Details with dynamic position -->
        <div
          class="details-input elevation"
          elevation="2"
          ?hidden="${!this.editedDetails.opened}"
          style="${this.getDetailsInputStyles()}"
        >
          <etools-textarea
            id="details-input"
            .value="${this.editedDetails.details}"
            max-rows="3"
            no-label-float
            placeholder="${translate('ACTIVITY_CHECKLIST.DETAIL_INPUT_PLACEHOLDER')}"
            @keyup="${() => this.onDetailsKeyUp()}"
            @keydown="${(event: KeyboardEvent) => this.onDetailsKeyDown(event)}"
            @blur="${() => this.updateItemDetails(this.editedDetails.id, this.editedDetails.details)}"
          ></etools-textarea>
        </div>

        <!-- Table Header -->
        <etools-data-table-header no-title no-collapse>
          <div class="checkbox-container layout horizontal center-center">
            <paper-checkbox
              ?checked="${this.allQuestionsEnabled}"
              class="nolabel"
              ?hidden="${!this.isEditMode}"
              @change="${(event: CustomEvent) =>
                this.toggleAll((event.target as PaperCheckboxElement).checked as boolean)}"
            ></paper-checkbox>
          </div>
          <etools-data-table-column class="flex-1" field="text">
            ${translate('ACTIVITY_CHECKLIST.COLUMNS.TEXT')}
          </etools-data-table-column>
          <etools-data-table-column class="flex-2" field="level">
            ${translate('ACTIVITY_CHECKLIST.COLUMNS.DETAILS')}
          </etools-data-table-column>
          <etools-data-table-column class="flex-none w210px">
            ${translate('ACTIVITY_CHECKLIST.COLUMNS.METHODS')}
          </etools-data-table-column>
        </etools-data-table-header>

        <!-- Table Row item -->
        ${this.questionsList.map(
          (question: IChecklistItem) => html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="layout horizontal editable-row flex">
                <!-- Checkbox to mark question  as enabled -->
                <div class="checkbox-container layout horizontal center-center">
                  <paper-checkbox
                    ?checked="${question.is_enabled}"
                    class="nolabel"
                    ?hidden="${!this.isEditMode}"
                    @change="${(event: CustomEvent) => {
                      question.is_enabled = (event.target as PaperCheckboxElement).checked as boolean;
                      this.requestUpdate();
                    }}"
                  ></paper-checkbox>
                  <img
                    src="${ROOT_PATH}assets/images/icon-check.svg"
                    ?hidden="${this.isEditMode || !question.is_enabled}"
                  />
                </div>

                <!-- Question item Text -->
                <div class="col-data flex-1 truncate">${question.text}</div>

                <!-- Editable Question Specific Details -->
                <div
                  class="col-data flex-2 truncate ${this.isEditMode ? 'edited-col' : ''}"
                  @click="${({currentTarget}: CustomEvent) =>
                    this.showDetailsInput(currentTarget as HTMLElement, question.id, question.specific_details)}"
                >
                  ${question.specific_details ||
                  (this.isEditMode
                    ? html` <span class="detail-placeholder">${translate('ACTIVITY_CHECKLIST.ADD_DETAIL')}</span> `
                    : '-')}
                </div>

                <!-- Question Methods -->
                <div class="col-data flex-none w210px truncate methods">
                  ${this.serializeMethods(question.question.methods)}
                </div>
              </div>
            </etools-data-table-row>
          `
        )}
      </div>
    </etools-card>
  `;
}
