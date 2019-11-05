import '../../file-components/file-select-input';
import {EditAttachmentsPopupComponent} from './edit-attachments-popup';
import {html, TemplateResult} from 'lit-element';
import {translate} from '../../../../localization/localisation';
import {InputStyles} from '../../../styles/input-styles';
import {DialogStyles} from '../../../styles/dialog-styles';

export function template(this: EditAttachmentsPopupComponent): TemplateResult {
  // language=HTML
  return html`
    ${InputStyles} ${DialogStyles}
    <style>
      .file-upload-container {
        padding: 20px 0 0;
      }
    </style>

    <etools-dialog
      size="md"
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      dialog-title="${translate(
        this.editedAttachment.id ? 'ATTACHMENTS_LIST.EDIT_POPUP_TITLE' : 'ATTACHMENTS_LIST.ADD_POPUP_TITLE'
      )}"
      @confirm-btn-clicked="${() => this.processRequest()}"
      @close="${this.onClose}"
      .okBtnText="${translate(this.editedAttachment.id ? 'MAIN.BUTTONS.SAVE' : 'MAIN.BUTTONS.ADD')}"
      no-padding
    >
      <etools-loading
        ?active="${this.savingInProcess}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="container layout vertical">
        <etools-dropdown
          class="validate-input disabled-as-readonly flex-1"
          .selected="${this.editedAttachment.file_type}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            (this.editedAttachment.file_type = detail.selectedItem.value)}"
          trigger-value-change-event
          label="${translate('ATTACHMENTS_LIST.FILE_TYPE_LABEL')}"
          placeholder="${translate('ATTACHMENTS_LIST.FILE_TYPE_PLACEHOLDER')}"
          required
          hide-search
          .options="${this.attachmentTypes}"
          option-label="display_name"
          option-value="value"
          ?invalid="${this.errors && this.errors.file_type}"
          .errorMessage="${this.errors && this.errors.file_type}"
          @focus="${() => this.resetFieldError('file_type')}"
          @tap="${() => this.resetFieldError('file_type')}"
          allow-outside-scroll
          dynamic-align
        ></etools-dropdown>
        <div class="file-upload-container">
          <file-select-input
            .fileData="${this.editedAttachment.file}"
            @file-selected="${(event: CustomEvent) => (this.selectedFile = event.detail.file)}"
            .hasDelete="${false}"
            .fileId="${this.editedAttachment.id}"
          ></file-select-input>
        </div>
      </div>
    </etools-dialog>
  `;
}
