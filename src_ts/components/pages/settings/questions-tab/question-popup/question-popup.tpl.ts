import '@unicef-polymer/etools-dropdown';
import '@polymer/paper-checkbox';
import '@polymer/paper-input/paper-textarea';
import {html, TemplateResult} from 'lit-element';
import {QuestionPopupComponent} from './question-popup';
import {translate} from '../../../../../localization/localisation';
import {repeat} from 'lit-html/directives/repeat';
import {PaperCheckboxElement} from '@polymer/paper-checkbox/paper-checkbox';
import {BOOLEAN_TYPE, SCALE_TYPE} from '../../../../common/dropdown-options';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';

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
      .okBtnText="${translate(this.editedData.id ? 'MAIN.BUTTONS.SAVE' : 'MAIN.BUTTONS.ADD')}"
      no-padding
    >
      <etools-loading
        ?active="${this.savingInProcess}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <div class="container layout vertical">
        <paper-textarea
          class="validate-input disabled-as-readonly flex-7"
          .value="${this.editedData.text}"
          @value-changed="${({detail}: CustomEvent) => this.updateModelValue('text', detail.value)}"
          max-rows="3"
          required
          label="${translate('QUESTIONS.LABELS.QUESTION')}"
          placeholder="${translate('QUESTIONS.PLACEHOLDERS.QUESTION')}"
          ?invalid="${this.errors && this.errors.text}"
          .errorMessage="${this.errors && this.errors.text}"
          @focus="${() => this.resetFieldError('text')}"
          @tap="${() => this.resetFieldError('text')}"
        ></paper-textarea>

        <etools-dropdown-multi
          class="validate-input disabled-as-readonly flex-2"
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
          .errorMessage="${this.errors && this.errors.sections}"
          @focus="${() => this.resetFieldError('sections')}"
          @tap="${() => this.resetFieldError('sections')}"
          allow-outside-scroll
          dynamic-align
        ></etools-dropdown-multi>

        <etools-dropdown-multi
          class="validate-input disabled-as-readonly flex-2"
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
          ?invalid="${this.errors && this.errors.methods}"
          .errorMessage="${this.errors && this.errors.methods}"
          @focus="${() => this.resetFieldError('methods')}"
          @tap="${() => this.resetFieldError('methods')}"
          allow-outside-scroll
          dynamic-align
        ></etools-dropdown-multi>

        <div class="layout horizontal">
          <etools-dropdown
            class="validate-input disabled-as-readonly w50"
            .selected="${this.editedData.category}"
            @etools-selected-item-changed="${({detail}: CustomEvent) =>
              this.updateModelValue('category', detail.selectedItem.id)}"
            trigger-value-change-event
            label="${translate('QUESTIONS.LABELS.CATEGORY')}"
            placeholder="${translate('QUESTIONS.PLACEHOLDERS.CATEGORY')}"
            required
            .options="${this.categories}"
            option-label="name"
            option-value="id"
            ?invalid="${this.errors && this.errors.category}"
            .errorMessage="${this.errors && this.errors.category}"
            @focus="${() => this.resetFieldError('category')}"
            @tap="${() => this.resetFieldError('category')}"
            allow-outside-scroll
            dynamic-align
          ></etools-dropdown>

          <etools-dropdown
            class="validate-input disabled-as-readonly w50"
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
          <paper-checkbox
            ?checked="${this.editedData.is_hact}"
            @change="${(event: CustomEvent) =>
              this.updateModelValue('is_hact', (event.target as PaperCheckboxElement).checked)}"
          >
            ${translate('QUESTIONS.LABELS.IS_HACT')}
          </paper-checkbox>
          <paper-checkbox
            ?checked="${this.editedData.is_active}"
            @change="${(event: CustomEvent) =>
              this.updateModelValue('is_active', (event.target as PaperCheckboxElement).checked)}"
          >
            ${translate('QUESTIONS.LABELS.IS_ACTIVE')}
          </paper-checkbox>
        </div>

        <div class="layout horizontal">
          <etools-dropdown
            class="validate-input disabled-as-readonly w50"
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
            class="validate-input disabled-as-readonly w25"
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
          ?hidden="${this.editedData.answer_type !== SCALE_TYPE && this.editedData.answer_type !== BOOLEAN_TYPE}"
        >
          ${repeat(
            this.editedData.options as Partial<QuestionOption>[],
            (option: EditedQuestionOption) => option.value,
            (option: EditedQuestionOption, index: number) => html`
              <div class="layout horizontal center" ?hidden="${option._delete}">
                <div class="option-index">${option.value}:</div>
                <paper-input
                  no-label-float
                  class="validate-input disabled-as-readonly flex-7"
                  .value="${option.label}"
                  @value-changed="${({detail}: CustomEvent) => this.changeOptionLabel(index, detail.value)}"
                  ?invalid="${!option.label && this.errors && this.errors.scale}"
                  .errorMessage="${!option.label && this.errors && this.errors.scale}"
                  maxlength="100"
                ></paper-input>
              </div>
            `
          )}
        </div>
      </div>
    </etools-dialog>
  `;
}
