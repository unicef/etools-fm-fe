import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@shoelace-style/shoelace/dist/components/checkbox/checkbox.js';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import '@unicef-polymer/etools-unicef/src/etools-date-time/datepicker-lite';
import {html, TemplateResult} from 'lit';
import {InputStyles} from '../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../styles/dialog-styles';
import {ActionPointsPopup} from './action-points-popup';

import {formatDate} from '@unicef-polymer/etools-utils/dist/date.util';
import {translate} from 'lit-translate';

export function template(this: ActionPointsPopup): TemplateResult {
  return html`
    ${InputStyles} ${DialogStyles}
    <etools-dialog
      size="md"
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      dialog-title="${translate(
        this.editedData.id ? 'ACTIVITY_ITEM.ACTION_POINTS.POPUP.EDIT_AP' : 'ACTIVITY_ITEM.ACTION_POINTS.POPUP.ADD_AP'
      )}"
      @confirm-btn-clicked="${() => this.save()}"
      @close="${this.onClose}"
      .okBtnText="${translate('MAIN.BUTTONS.SAVE')}"
      .cancelBtnText="${translate('MAIN.BUTTONS.CANCEL')}"
    >
      <etools-loading
        ?active="${this.savingInProcess}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <!--     Description   -->
      <etools-textarea
        class="validate-input additional-padding"
        .value="${this.editedData.description}"
        @value-changed="${({detail}: CustomEvent) => this.updateModelValue('description', detail.value)}"
        required
        label="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.DESCRIPTION')}"
        max-rows="3"
        placeholder="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.ENTER_DESCRIPTION')}"
        ?invalid="${this.errors && this.errors.description}"
        .errorMessage="${this.errors && this.errors.description}"
        @focus="${() => this.resetFieldError('description')}"
        @click="${() => this.resetFieldError('description')}"
      ></etools-textarea>

      <div class="grid-container">
        <!--    Assignee    -->
        <etools-dropdown
          class="without-border flex additional-padding"
          .selected="${this.editedData.assigned_to}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.updateModelValue('assigned_to', detail.selectedItem && detail.selectedItem.id)}"
          ?trigger-value-change-event="${this.users.length}"
          required
          label="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.ASSIGNEE')}"
          placeholder="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.ASSIGN_TO')}"
          .options="${this.users}"
          option-label="name"
          option-value="id"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.assigned_to}"
          .errorMessage="${this.errors && this.errors.assigned_to}"
          @focus="${() => this.resetFieldError('assigned_to')}"
          @click="${() => this.resetFieldError('assigned_to')}"
        ></etools-dropdown>

        <!--    Due on     -->
        <datepicker-lite
          class="without-border"
          value="${this.editedData.due_date || ''}"
          fire-date-has-changed
          label="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.DUE_ON')}"
          @date-has-changed="${({detail}: CustomEvent) =>
            this.updateModelValue('due_date', detail.date ? formatDate(detail.date, 'YYYY-MM-DD') : null)}"
          dynamic-align
          selected-date-display-format="D MMM YYYY"
        ></datepicker-lite>

        <!--    Section     -->
        <etools-dropdown
          class="without-border flex additional-padding"
          .selected="${this.editedData.section}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.updateModelValue('section', detail.selectedItem && detail.selectedItem.id)}"
          ?trigger-value-change-event="${this.sections.length}"
          required
          label="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.SECTION')}"
          placeholder="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.SELECT_SECTION')}"
          .options="${this.sections}"
          option-label="name"
          option-value="id"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.section}"
          .errorMessage="${this.errors && this.errors.section}"
          @focus="${() => this.resetFieldError('section')}"
          @click="${() => this.resetFieldError('section')}"
        ></etools-dropdown>

        <!--    Offices    -->
        <etools-dropdown
          class="without-border flex additional-padding"
          .selected="${this.editedData.office}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.updateModelValue('office', detail.selectedItem && detail.selectedItem.id)}"
          ?trigger-value-change-event="${this.offices && this.offices.length}"
          required
          label="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.OFFICES')}"
          placeholder="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.SELECT_OFFICE')}"
          .options="${this.offices}"
          option-label="name"
          option-value="id"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.office}"
          .errorMessage="${this.errors && this.errors.office}"
          @focus="${() => this.resetFieldError('office')}"
          @click="${() => this.resetFieldError('office')}"
        ></etools-dropdown>

        <!--    Related To    -->
        <etools-dropdown
          class="without-border flex additional-padding"
          .selected="${this.selectedRelatedTo}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.setSelectedRelatedTo(detail.selectedItem && detail.selectedItem.value)}"
          trigger-value-change-event
          required
          label="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.RELATED_TO')}"
          placeholder="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.SELECT_RELATED_TO')}"
          .options="${this.levels}"
          option-label="display_name"
          option-value="value"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.related_to}"
          .errorMessage="${this.errors && this.errors.related_to}"
          @focus="${() => this.resetFieldError('related_to')}"
          @click="${() => this.resetFieldError('related_to')}"
        ></etools-dropdown>

        <!--    Related Name    -->
        <etools-dropdown
          class="without-border flex additional-padding"
          .selected="${this.getSelectedRelatedName()}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.updateEditableDataRelationContent(detail.selectedItem)}"
          ?trigger-value-change-event="${this.getRelatedNames().length}"
          required
          label="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.RELATED_NAME')}"
          placeholder="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.SELECT_RELATED_NAME')}"
          .options="${this.getRelatedNames()}"
          option-label="name"
          option-value="id"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.related_name}"
          .errorMessage="${this.errors && this.errors.related_name}"
          @focus="${() => this.resetFieldError('related_name')}"
          @click="${() => this.resetFieldError('related_name')}"
        ></etools-dropdown>

        <!--   Categories   -->
        <etools-dropdown
          class="without-border flex additional-padding"
          .selected="${this.editedData.category}"
          @etools-selected-item-changed="${({detail}: CustomEvent) => {
            this.updateModelValue('category', detail.selectedItem && detail.selectedItem.id);
          }}"
          ?trigger-value-change-event="${this.categories && this.categories.length}"
          required
          label="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.CATEGORIES')}"
          placeholder="${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.SELECT_CATEGORY')}"
          .options="${this.categories}"
          option-label="description"
          option-value="id"
          allow-outside-scroll
          dynamic-align
          ?invalid="${this.errors && this.errors.category}"
          .errorMessage="${this.errors && this.errors.category}"
          @focus="${() => this.resetFieldError('category')}"
          @click="${() => this.resetFieldError('category')}"
        ></etools-dropdown>

        <!--    Priority    -->
        <div class="without-border flex priority-container additional-padding">
          <sl-checkbox
            class="priority"
            ?checked="${this.editedData.high_priority}"
            @sl-change="${(e: any) => this.updateModelValue('high_priority', e.target.checked)}"
          >
            ${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.HIGH_PRIORITY')}
          </sl-checkbox>
        </div>

        ${this.url
          ? html`
              <div class="without-border flex">
                <a class="link-cell action-point-link" href="${this.url}" target="_blank"
                  >${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.GO_TO_ACTION_POINTS_TO_COMPLETE')}
                  <etools-icon-button name="launch"></etools-icon-button
                ></a>
              </div>
            `
          : ''}
      </div>
    </etools-dialog>
  `;
}
