import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown-multi';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {html, TemplateResult} from 'lit';
import {QuestionPopupComponent} from './question-popup';
import {repeat} from 'lit/directives/repeat.js';
import {BOOL_TYPE, SCALE_TYPE} from '../../../../common/dropdown-options';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {translate} from 'lit-translate';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

export function template(this: QuestionPopupComponent): TemplateResult {
  return html`
    ${InputStyles} ${DialogStyles}
    <etools-dialog
      size="md"
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      dialog-title="${translate(this.editedData.id ? 'QUESTIONS.EDIT_POPUP_TITLE' : 'QUESTIONS.ADD_POPUP_TITLE')}"
      @confirm-btn-clicked="${() => this.processRequest()}"
      @close="${this.onClose}"
      .cancelBtnText="${translate('CANCEL')}"
      .okBtnText="${translate(this.editedData.id ? 'MAIN.BUTTONS.SAVE' : 'MAIN.BUTTONS.ADD')}"
      no-padding
    >
      <etools-loading
        ?active="${this.savingInProcess}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <div class="container layout vertical">
        <etools-textarea
          class="validate-input flex-7 question-textarea"
          .value="${this.editedData.text}"
          @value-changed="${({detail}: CustomEvent) => this.updateModelValue('text', detail.value)}"
          max-rows="3"
          required
          label="${translate('QUESTIONS.LABELS.QUESTION')}"
          placeholder="${translate('QUESTIONS.PLACEHOLDERS.QUESTION')}"
          ?invalid="${this.errors && this.errors.text}"
          .errorMessage="${(this.errors && this.errors.text) || translate('THIS_FIELD_IS_REQUIRED')}"
          @focus="${() => {
            this.autoValidateQuestion = true;
            this.resetFieldError('text');
          }}"
          .autoValidate="${this.autoValidateQuestion}"
          @click="${() => this.resetFieldError('text')}"
        ></etools-textarea>

        <etools-dropdown-multi
          class="validate-input flex-2"
          .selectedValues="${this.editedData.sections}"
          @etools-selected-items-changed="${({detail}: CustomEvent) =>
            this.updateModelValue('sections', detail.selectedItems)}"
          trigger-value-change-event
          label="${translate('QUESTIONS.LABELS.SECTIONS')}"
          placeholder="${translate('QUESTIONS.PLACEHOLDERS.SECTIONS')}"
          .options="${this.sections}"
          option-label="name"
          option-value="id"
          ?invalid="${this.errors && this.errors.sections}"
          .errorMessage="${(this.errors && this.errors.sections) || translate('THIS_FIELD_IS_REQUIRED')}"
          @focus="${() => this.resetFieldError('sections')}"
          @tap="${() => this.resetFieldError('sections')}"
          auto-validate
          allow-outside-scroll
          dynamic-align
        ></etools-dropdown-multi>

        <etools-dropdown-multi
          class="validate-input flex-2"
          .selectedValues="${this.editedData.methods}"
          @etools-selected-items-changed="${({detail}: CustomEvent) =>
            this.updateModelValue('methods', detail.selectedItems)}"
          trigger-value-change-event
          hide-search
          label="${translate('QUESTIONS.LABELS.METHODS')}"
          placeholder="${translate('QUESTIONS.PLACEHOLDERS.METHODS')}"
          .options="${this.methods}"
          option-label="name"
          option-value="id"
          required
          ?invalid="${this.errors && this.errors.methods}"
          .errorMessage="${(this.errors && this.errors.methods) || translate('THIS_FIELD_IS_REQUIRED')}"
          @focus="${() => this.resetFieldError('methods')}"
          @tap="${() => this.resetFieldError('methods')}"
          auto-validate
          allow-outside-scroll
          dynamic-align
        ></etools-dropdown-multi>

        <div class="layout horizontal">
          <etools-dropdown
            class="validate-input w50"
            .selected="${this.editedData.category}"
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.updateModelValue('category', detail.selectedItem && detail.selectedItem.id)}"
            trigger-value-change-event
            label="${translate('QUESTIONS.LABELS.GROUP')}"
            placeholder="${translate('QUESTIONS.PLACEHOLDERS.GROUP')}"
            required
            .options="${this.categories}"
            option-label="name"
            option-value="id"
            ?invalid="${this.errors && this.errors.category}"
            .errorMessage="${(this.errors && this.errors.category) || translate('THIS_FIELD_IS_REQUIRED')}"
            @focus="${() => {
              this.resetFieldError('category');
              this.autovlidateCateg = true;
            }}"
            @tap="${() => this.resetFieldError('category')}"
            .autoValidate="${this.autovlidateCateg}"
            allow-outside-scroll
            dynamic-align
          ></etools-dropdown>

          <etools-dropdown
            class="validate-input w50"
            .selected="${this.editedData.level}"
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.updateModelValue('level', detail.selectedItem.value)}"
            trigger-value-change-event
            hide-search
            label="${translate('QUESTIONS.LABELS.LEVEL')}"
            placeholder="${translate('QUESTIONS.PLACEHOLDERS.LEVEL')}"
            .options="${this.levels}"
            option-label="display_name"
            option-value="value"
            ?invalid="${this.errors && this.errors.level}"
            .errorMessage="${this.errors && this.errors.level}"
            @focus="${() => this.resetFieldError('level')}"
            @tap="${() => this.resetFieldError('level')}"
            allow-outside-scroll
            dynamic-align
          ></etools-dropdown>
        </div>

        <div class="checkboxes">
          <sl-checkbox
            ?checked="${this.editedData.is_hact}"
            @sl-change="${(e: any) => this.updateModelValue('is_hact', e.target.checked)}"
          >
            ${translate('QUESTIONS.LABELS.IS_HACT')}
          </sl-checkbox>
          <sl-checkbox
            ?checked="${this.editedData.is_active}"
            @sl-change="${(e: any) => this.updateModelValue('is_active', e.target.checked)}"
          >
            ${translate('QUESTIONS.LABELS.IS_ACTIVE')}
          </sl-checkbox>
        </div>

        <div class="layout horizontal">
          <etools-dropdown
            class="validate-input w50"
            .selected="${this.editedData.answer_type}"
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.updateAnswerType(detail.selectedItem.value)}"
            trigger-value-change-event
            hide-search
            label="${translate('QUESTIONS.LABELS.ANSWER_TYPE')}"
            placeholder="${translate('QUESTIONS.PLACEHOLDERS.ANSWER_TYPE')}"
            .options="${this.answerTypes}"
            option-label="display_name"
            option-value="value"
            ?invalid="${this.errors && this.errors.answer_type}"
            .errorMessage="${this.errors && this.errors.answer_type}"
            @focus="${() => this.resetFieldError('answer_type')}"
            @tap="${() => this.resetFieldError('answer_type')}"
            allow-outside-scroll
            dynamic-align
          ></etools-dropdown>

          <etools-dropdown
            class="validate-input w25"
            ?hidden="${this.editedData.answer_type !== SCALE_TYPE}"
            .selected="${this.currentOptionsLength}"
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.changeOptionsSize(detail.selectedItem && detail.selectedItem.value)}"
            trigger-value-change-event
            hide-search
            label="${translate('QUESTIONS.LABELS.SCALE_SIZE')}"
            placeholder="${translate('QUESTIONS.PLACEHOLDERS.SCALE_SIZE')}"
            .options="${this.scaleSizes}"
            option-label="display_name"
            option-value="value"
            allow-outside-scroll
            dynamic-align
          ></etools-dropdown>
        </div>

        <div
          class="scales-container"
          ?hidden="${this.editedData.answer_type !== SCALE_TYPE && this.editedData.answer_type !== BOOL_TYPE}"
        >
          ${repeat(
            this.editedData.options as Partial<QuestionOption>[],
            (option: EditedQuestionOption) => option.value,
            (option: EditedQuestionOption, index: number) => html`
              <div class="layout horizontal center">
                <div class="option-index">${option.translation ? option.translation : option.value}:</div>
                <etools-input
                  no-label-float
                  class="validate-input flex-7"
                  .value="${option.label}"
                  @value-changed="${({detail}: CustomEvent) => this.changeOptionLabel(index, detail.value)}"
                  ?invalid="${this.errors?.options && this.errors.options[index]?.label}"
                  .errorMessage="${this.errors?.options && this.errors.options[index]?.label}"
                  @focus="${() => this.resetFieldError('options', index)}"
                  @click="${() => this.resetFieldError('options', index)}"
                  maxlength="100"
                ></etools-input>
              </div>
            `
          )}
        </div>
      </div>
    </etools-dialog>
  `;
}
