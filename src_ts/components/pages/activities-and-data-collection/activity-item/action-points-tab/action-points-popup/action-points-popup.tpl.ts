import '@unicef-polymer/etools-dropdown';
import '@unicef-polymer/etools-dialog';
import '@polymer/paper-checkbox';
import '@polymer/paper-input/paper-textarea';
import '@unicef-polymer/etools-date-time/datepicker-lite';
import {html, TemplateResult} from 'lit-element';
import {InputStyles} from '../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../styles/dialog-styles';
import {ActionPointsPopup} from './action-points-popup';
import {translate} from '../../../../../../localization/localisation';
import {PaperCheckboxElement} from '@polymer/paper-checkbox/paper-checkbox';
import {formatDate} from '../../../../../utils/date-utility';
import {LEVELS} from '../../../../../common/dropdown-options';

export function template(this: ActionPointsPopup): TemplateResult {
  return html`
    ${InputStyles} ${DialogStyles}
    <etools-dialog
      size="md"
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      dialog-title="Create action point"
      @confirm-btn-clicked="${() => this.save()}"
      @close="${this.onClose}"
      .okBtnText="${translate('MAIN.BUTTONS.SAVE')}"
      no-padding
    >
      <etools-loading
        ?active="${this.savingInProcess}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <!--     Description   -->
      <paper-textarea
        class="validate-input"
        .value="${this.editedData.description}"
        @value-changed="${({detail}: CustomEvent) => this.updateModelValue('description', detail.value)}"
        required
        label="Description"
        max-rows="3"
        placeholder="Enter description"
        ?invalid="${this.errors && this.errors.description}"
        .errorMessage="${this.errors && this.errors.description}"
        @focus="${() => this.resetFieldError('description')}"
        @tap="${() => this.resetFieldError('description')}"
      ></paper-textarea>

      <div class="grid-container">
        <!--    Assignee    -->
        <etools-dropdown
          class="without-border flex"
          .selected="${this.editedData.assigned_to}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.updateModelValue('assigned_to', detail.selectedItem && detail.selectedItem.id)}"
          ?trigger-value-change-event="${this.users.length}"
          required
          label="Assignee"
          placeholder="Assign to"
          .options="${this.users}"
          option-label="name"
          option-value="id"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.assigned_to}"
          .errorMessage="${this.errors && this.errors.assigned_to}"
          @focus="${() => this.resetFieldError('assigned_to')}"
          @tap="${() => this.resetFieldError('assigned_to')}"
        ></etools-dropdown>

        <!--    Due on     -->
        <datepicker-lite
          class="without-border"
          value="${this.editedData.due_date || ''}"
          fire-date-has-changed
          label="Due on"
          @date-has-changed="${({detail}: CustomEvent) => this.updateModelValue('due_date', formatDate(detail.date))}"
          dynamic-align
        ></datepicker-lite>

        <!--    Section     -->
        <etools-dropdown
          class="without-border flex"
          .selected="${this.editedData.section}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.updateModelValue('section', detail.selectedItem && detail.selectedItem.id)}"
          ?trigger-value-change-event="${this.sections.length}"
          required
          label="Section"
          placeholder="Select Section"
          .options="${this.sections}"
          option-label="name"
          option-value="id"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.section}"
          .errorMessage="${this.errors && this.errors.section}"
          @focus="${() => this.resetFieldError('section')}"
          @tap="${() => this.resetFieldError('section')}"
        ></etools-dropdown>

        <!--    Offices    -->
        <etools-dropdown
          class="without-border flex"
          .selected="${this.editedData.office}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.updateModelValue('office', detail.selectedItem && detail.selectedItem.id)}"
          ?trigger-value-change-event="${this.offices && this.offices.length}"
          required
          label="Offices"
          placeholder="Select Office"
          .options="${this.offices}"
          option-label="name"
          option-value="id"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.office}"
          .errorMessage="${this.errors && this.errors.office}"
          @focus="${() => this.resetFieldError('office')}"
          @tap="${() => this.resetFieldError('office')}"
        ></etools-dropdown>

        <!--    Related To    -->
        <etools-dropdown
          class="without-border flex"
          .selected="${this.selectedRelatedTo}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.setSelectedRelatedTo(detail.selectedItem && detail.selectedItem.value)}"
          trigger-value-change-event
          required
          label="Related To"
          placeholder="Select Related To"
          .options="${LEVELS}"
          option-label="display_name"
          option-value="value"
          allow-outside-scroll
          dynamic-align
        ></etools-dropdown>

        <!--    Related Name    -->
        <etools-dropdown
          class="without-border flex"
          .selected="${this.getSelectedRelatedName()}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.updateEditableDataRelationContent(detail.selectedItem)}"
          trigger-value-change-event
          required
          label="Related Name"
          placeholder="Select Related Name"
          .options="${this.getRelatedNames()}"
          option-label="name"
          option-value="id"
          allow-outside-scroll
          dynamic-align
        ></etools-dropdown>

        <!--   Categories   -->
        <etools-dropdown
          class="without-border flex"
          .selected="${this.editedData.category}"
          @etools-selected-item-changed="${({detail}: CustomEvent) => {
            this.updateModelValue('category', detail.selectedItem && detail.selectedItem.id);
          }}"
          ?trigger-value-change-event="${this.categories && this.categories.length}"
          required
          label="Categories"
          placeholder="Select Category"
          .options="${this.categories}"
          option-label="description"
          option-value="id"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.category}"
          .errorMessage="${this.errors && this.errors.category}"
          @focus="${() => this.resetFieldError('category')}"
          @tap="${() => this.resetFieldError('category')}"
        ></etools-dropdown>

        <!--    Priority    -->
        <div class="without-border flex priority-container">
          <paper-checkbox
            class="priority"
            ?checked="${this.editedData.high_priority}"
            @change="${(event: CustomEvent) =>
              this.updateModelValue('high_priority', (event.target as PaperCheckboxElement).checked)}"
          >
            High Priority
          </paper-checkbox>
        </div>
      </div>
    </etools-dialog>
  `;
}
