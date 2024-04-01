import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table.js';
import '@unicef-polymer/etools-unicef/src/etools-checkbox/etools-checkbox';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-loading/etools-loading';
import '../../../../../common/layout/etools-card';
import {html, TemplateResult} from 'lit';
import {ChecklistSelectionTable} from './checklist-selection-table';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';
import {ROOT_PATH} from '../../../../../../config/config';
import {InputStyles} from '../../../../../styles/input-styles';
import {translate} from 'lit-translate';
import {FormBuilderCardStyles} from '@unicef-polymer/etools-form-builder/dist/lib/styles/form-builder-card.styles';

export function template(this: ChecklistSelectionTable): TemplateResult {
  return html`
    ${InputStyles}
    <style>
      ${FormBuilderCardStyles}
      ${dataTableStylesLit}
      .sm-header {
        margin-top: 4px;
        margin-left: 24px;
        font-weight: 700;
        color: var(--secondary-text-color);
      }
      .sm-header etools-checkbox {
        margin-right: 6px;
      }
    </style>
    <etools-media-query
      query="(max-width: 767px)"
      @query-matches-changed="${(e: CustomEvent) => {
        this.lowResolutionLayout = e.detail.value;
      }}"
    ></etools-media-query>
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
        <etools-data-table-header no-title no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
          <etools-data-table-column class="col-data col-4" field="text">
            <div class="checkbox-container layout-horizontal center-align">
              <etools-checkbox
                ?checked="${this.allQuestionsEnabled}"
                class="nolabel ${this.lowResolutionLayout ? '' : 'mt-4'}"
                ?hidden="${!this.isEditMode}"
                @sl-change="${(e: any) => this.toggleAll(e.target.checked as boolean)}"
              ></etools-checkbox>
            </div>
            ${translate('ACTIVITY_CHECKLIST.COLUMNS.TEXT')}
          </etools-data-table-column>
          <etools-data-table-column class="col-data col-6" field="level">
            ${translate('ACTIVITY_CHECKLIST.COLUMNS.DETAILS')}
          </etools-data-table-column>
          <etools-data-table-column class="col-data col-2">
            ${translate('ACTIVITY_CHECKLIST.COLUMNS.METHODS')}
          </etools-data-table-column>
        </etools-data-table-header>

        ${this.lowResolutionLayout ? html`
        <div class="layout-horizontal sm-header">
          <etools-checkbox
            ?checked="${this.allQuestionsEnabled}"
            ?hidden="${!this.isEditMode}"
            @sl-change="${(e: any) => this.toggleAll(e.target.checked as boolean)}"
          ></etools-checkbox>
          <span>${translate('ACTIVITY_CHECKLIST.COLUMNS.TEXT')}</span>
        </div>` : ``}      

        <!-- Table Row item -->
        ${this.questionsList.map(
          (question: IChecklistItem) => html`
            <etools-data-table-row no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
              <div slot="row-data" class="editable-row row">
                <!-- Question item Text -->
                <div
                  class="col-data col-4"
                  data-col-header-label="${translate('ACTIVITY_CHECKLIST.COLUMNS.TEXT')}"
                >
                  <!-- Checkbox to mark question  as enabled -->
                  <div class="checkbox-container layout-horizontal center-align">
                    <etools-checkbox
                      ?checked="${question.is_enabled}"
                      class="nolabel ${this.lowResolutionLayout ? '' : 'mt-4'}"
                      ?hidden="${!this.isEditMode}"
                      @sl-change="${(e: any) => {
                        question.is_enabled = e.target.checked as boolean;
                        this.requestUpdate();
                      }}"
                    ></etools-checkbox>
                    <img
                      class="${this.lowResolutionLayout ? '' : 'mt-4'}"
                      src="${ROOT_PATH}assets/images/icon-check.svg"
                      ?hidden="${this.isEditMode || !question.is_enabled}"
                    />
                  </div>
                  ${question.text}
                </div>

                <!-- Editable Question Specific Details -->
                <div
                  class="col-data col-6 ${this.isEditMode ? 'edited-col' : ''}"
                  @click="${({currentTarget}: CustomEvent) =>
                    this.showDetailsInput(currentTarget as HTMLElement, question.id, question.specific_details)}"
                  data-col-header-label="${translate('ACTIVITY_CHECKLIST.COLUMNS.DETAILS')}"
                >
                  ${question.specific_details ||
                  (this.isEditMode
                    ? html` <span class="detail-placeholder">${translate('ACTIVITY_CHECKLIST.COLUMNS.METHODS')}</span> `
                    : '-')}
                </div>

                <!-- Question Methods -->
                <div
                  class="col-data col-2 methods"
                  data-col-header-label="${translate('ACTIVITIES_LIST.COLUMNS.START_DATE')}"
                >
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
