import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-unicef/src/etools-dropdown/etools-dropdown';
import '@unicef-polymer/etools-unicef/src/etools-checkbox/etools-checkbox';
import '@unicef-polymer/etools-unicef/src/etools-input/etools-textarea';
import {html, TemplateResult} from 'lit';
import {InputStyles} from '../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../styles/dialog-styles';
import {TPMActionPointsPopup} from './tpm-action-points-popup';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';

export function template(this: TPMActionPointsPopup): TemplateResult {
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
      <div class="row">
        <!--     Description   -->
        <etools-textarea
          class="col-12 validate-input additional-padding"
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
      </div>
      <div class="row">
        <!--   Categories   -->
        <etools-dropdown
          class="col-md-6 col-12 without-border flex additional-padding"
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
        <div class="col-md-6 col-12 without-border flex priority-container additional-padding">
          <etools-checkbox
            class="priority"
            ?checked="${this.editedData.high_priority}"
            @sl-change="${(e: any) => this.updateModelValue('high_priority', e.target.checked)}"
          >
            ${translate('ACTIVITY_ITEM.ACTION_POINTS.POPUP.HIGH_PRIORITY')}
          </etools-checkbox>
        </div>
      </div>
    </etools-dialog>
  `;
}
