import '@unicef-polymer/etools-unicef/src/etools-data-table/etools-data-table';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-checkbox/etools-checkbox';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-input';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-media-query/etools-media-query.js';
import {TemplatesTabComponent} from './templates-tab';
import {html, TemplateResult} from 'lit';
import {hasPermission, Permissions} from '../../../../config/permissions';
import {INTERVENTION, OUTPUT, PARTNER} from '../../../common/dropdown-options';
import {InputStyles} from '../../../styles/input-styles';
import {translate} from 'lit-translate';
import {dataTableStylesLit} from '@unicef-polymer/etools-unicef/src/etools-data-table/styles/data-table-styles';

export function template(this: TemplatesTabComponent): TemplateResult {
  return html`
    <style>
      ${dataTableStylesLit}
    </style>
    <etools-media-query
      query="(max-width: 767px)"
      @query-matches-changed="${(e: CustomEvent) => {
        this.lowResolutionLayout = e.detail.value;
      }}"
    ></etools-media-query>
    ${InputStyles}
    <section class="filters-container elevation row page-content card-container question-filters-section" elevation="1">
      <div class="filter col-md-2 col-12">
        <etools-dropdown
          .options="${this.levels}"
          .selected="${(this.queryParams && this.queryParams.level) || undefined}"
          @etools-selected-item-changed="${({detail}: CustomEvent) => this.onLevelChanged(detail.selectedItem?.value)}"
          trigger-value-change-event
          hide-search
          label="${translate('TEMPLATES.FILTERS.LEVEL_LABEL')}"
          placeholder="${translate('TEMPLATES.FILTERS.LEVEL_PLACEHOLDER')}"
          .minWidth="160px"
          horizontal-align="left"
          no-dynamic-align
          option-label="display_name"
          option-value="value"
        ></etools-dropdown>
      </div>

      <div class="filter col-md-2 col-12">
        <etools-dropdown
          ?hidden="${!this.queryParams || this.queryParams.level !== PARTNER}"
          .options="${this.partners}"
          .selected="${this.getSelectedTarget(PARTNER, this.partners)}"
          @etools-selected-item-changed="${({detail}: CustomEvent) => this.onTargetChanged(detail.selectedItem)}"
          trigger-value-change-event
          enable-none-option
          label="${translate('TEMPLATES.FILTERS.PARTNER_LABEL')}"
          placeholder="${translate('TEMPLATES.FILTERS.PARTNER_PLACEHOLDER')}"
          .minWidth="160px"
          .autoWidth="${true}"
          horizontal-align="left"
          no-dynamic-align
          option-label="name"
          option-value="id"
        ></etools-dropdown>

        <etools-dropdown
          ?hidden="${!this.queryParams || this.queryParams.level !== OUTPUT}"
          .options="${this.outputs}"
          .selected="${this.getSelectedTarget(OUTPUT, this.outputs)}"
          @etools-selected-item-changed="${({detail}: CustomEvent) => this.onTargetChanged(detail.selectedItem)}"
          trigger-value-change-event
          enable-none-option
          label="${translate('TEMPLATES.FILTERS.OUTPUT_LABEL')}"
          placeholder="${translate('TEMPLATES.FILTERS.OUTPUT_PLACEHOLDER')}"
          .minWidth="160px"
          .autoWidth="${true}"
          horizontal-align="left"
          no-dynamic-align
          option-label="name"
          option-value="id"
        ></etools-dropdown>

        <etools-dropdown
          ?hidden="${!this.queryParams || this.queryParams.level !== INTERVENTION}"
          .options="${this.interventions}"
          .selected="${this.getSelectedTarget(INTERVENTION, this.interventions)}"
          @etools-selected-item-changed="${({detail}: CustomEvent) => this.onTargetChanged(detail.selectedItem)}"
          trigger-value-change-event
          enable-none-option
          label="${translate('TEMPLATES.FILTERS.INTERVENTION_LABEL')}"
          placeholder="${translate('TEMPLATES.FILTERS.INTERVENTION_PLACEHOLDER')}"
          .minWidth="160px"
          .autoWidth="${true}"
          horizontal-align="left"
          no-dynamic-align
          option-label="title"
          option-value="id"
        ></etools-dropdown>
      </div>
    </section>

    <!-- Table -->
    <section
      class="elevation page-content card-container templates-table-section"
      elevation="1"
      ?hidden="${!this.queryParams || !this.queryParams.level}"
    >
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
          placeholder="${translate('TEMPLATES.DETAIL_INPUT_PLACEHOLDER')}"
          @keyup="${() => this.onDetailsKeyUp()}"
          @keydown="${(event: KeyboardEvent) => this.onDetailsKeyDown(event)}"
          @blur="${() => this.updateTemplate(this.editedDetails.id, 'specific_details', this.editedDetails.details)}"
        ></etools-textarea>
      </div>

      <!-- Spinner -->
      <etools-loading
        ?active="${this.loadingInProcess}"
        loading-text="${translate('MAIN.LOADING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <!-- Table Header -->
      <etools-data-table-header no-title no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
        <div class="checkbox-container"></div>
        <etools-data-table-column class="col-data table-header-padding col-md-4" field="text">
          ${translate('TEMPLATES.COLUMNS.TEXT')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data table-header-padding col-md-7" field="level">
          ${translate('TEMPLATES.COLUMNS.DETAILS')}
        </etools-data-table-column>
        <etools-data-table-column class="col-data table-header-padding col-md-1">
          ${translate('TEMPLATES.COLUMNS.METHODS')}
        </etools-data-table-column>
      </etools-data-table-header>

      <!-- Table Empty Row -->
      ${this.loadingInProcess || !this.items.length
        ? html`
            <etools-data-table-row no-collapse>
              <div slot="row-data" class="editable-row row">
                <div class="col-data col-12 no-data">${translate('NO_RECORDS')}</div>
              </div>
            </etools-data-table-row>
          `
        : ''}

      <!-- Table Row item -->
      ${!this.loadingInProcess
        ? this.items.map(
            (questionTemplate: IQuestionTemplate) => html`
              <etools-data-table-row no-collapse .lowResolutionLayout="${this.lowResolutionLayout}">
                <div slot="row-data" class="editable-row row">
                  <!-- Question item Text -->
                  <div class="col-data col-md-4" data-col-header-label="${translate('TEMPLATES.COLUMNS.TEXT')}">
                    <!-- Checkbox to mark template as active -->
                    <div class="checkbox-container layout-horizontal center-align">
                      <etools-checkbox
                        ?disabled=${!hasPermission(Permissions.EDIT_QUESTION_TEMPLATES)}
                        ?checked="${questionTemplate.template && questionTemplate.template.is_active}"
                        class="nolabel"
                        @sl-change="${(e: any) =>
                          this.updateTemplate(questionTemplate.id, 'is_active', e.target.checked as boolean)}"
                      ></etools-checkbox>
                    </div>
                    ${questionTemplate.text}
                  </div>

                  <!-- Editable Question Specific Details -->
                  <div
                    data-col-header-label="${translate('TEMPLATES.COLUMNS.DETAILS')}"
                    class="col-data col-md-7 ${hasPermission(Permissions.EDIT_QUESTION_TEMPLATES) ? 'edited-col' : ''}"
                    @click="${({currentTarget}: CustomEvent) =>
                      this.showDetailsInput(
                        currentTarget as HTMLElement,
                        questionTemplate.id,
                        questionTemplate.template && questionTemplate.template.specific_details
                      )}"
                  >
                    ${(questionTemplate.template && questionTemplate.template.specific_details) ||
                    (hasPermission(Permissions.EDIT_QUESTION_TEMPLATES)
                      ? html` <span class="detail-placeholder">${translate('TEMPLATES.ADD_DETAIL')}</span> `
                      : '-')}
                  </div>

                  <!-- Question Methods -->
                  <div
                    class="col-data col-md-1 methods"
                    data-col-header-label="${translate('TEMPLATES.COLUMNS.METHODS')}"
                  >
                    ${this.serializeMethods(questionTemplate.methods)}
                  </div>
                </div>
              </etools-data-table-row>
            `
          )
        : ''}

      <!-- Table Paginator -->
      <etools-data-table-footer
        id="footer"
        .rowsPerPageText="${translate('ROWS_PER_PAGE')}"
        .pageSize="${(this.queryParams && this.queryParams.page_size) || undefined}"
        .pageNumber="${(this.queryParams && this.queryParams.page) || undefined}"
        .totalResults="${this.count}"
        @page-size-changed="${(event: CustomEvent) => this.changePageParam(event.detail.value, 'page_size')}"
        @page-number-changed="${(event: CustomEvent) => this.changePageParam(event.detail.value, 'page')}"
        .lowResolutionLayout="${this.lowResolutionLayout}"
      >
      </etools-data-table-footer>
    </section>
  `;
}
