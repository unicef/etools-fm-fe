import '../../file-components/file-select-input';
import '@unicef-polymer/etools-upload/etools-upload';
import {EditAttachmentsPopupComponent} from './edit-attachments-popup';
import {html, TemplateResult} from 'lit-element';
import {translate} from '../../../../localization/localisation';
import {InputStyles} from '../../../styles/input-styles';
import {DialogStyles} from '../../../styles/dialog-styles';
import {ATTACHMENTS_STORE} from '../../../../endpoints/endpoints-list';
import {getEndpoint} from '../../../../endpoints/endpoints';

export function template(this: EditAttachmentsPopupComponent): TemplateResult {
  // language=HTML
  return html`
    ${InputStyles} ${DialogStyles}
    <style>
      .file-upload-container {
        padding: 0 12px;
      }
    </style>

    <etools-dialog
      size="md"
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      dialog-title="${translate(
        this.editedData.id ? 'ATTACHMENTS_LIST.EDIT_POPUP_TITLE' : 'ATTACHMENTS_LIST.ADD_POPUP_TITLE'
      )}"
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
        <etools-dropdown
          class="validate-input disabled-as-readonly flex-1"
          .selected="${this.editedData.file_type}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            (this.editedData.file_type = detail.selectedItem && detail.selectedItem.value)}"
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
            hidden
            .fileData="${this.editedData.file}"
            @file-selected="${(event: CustomEvent) => (this.selectedFileId = event.detail.file)}"
            .hasDelete="${false}"
            .fileId="${this.editedData.id}"
          ></file-select-input>

          <etools-upload
            .showDeleteBtn="${false}"
            .fileUrl="${this.editedData && this.editedData.file}"
            .uploadEndpoint="${getEndpoint(ATTACHMENTS_STORE).url}"
            @upload-finished="${(event: CustomEvent) => this.fileSelected(event.detail)}"
          ></etools-upload>
        </div>
      </div>
    </etools-dialog>
  `;
}
