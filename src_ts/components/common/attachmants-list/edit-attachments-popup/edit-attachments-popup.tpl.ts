import '../../file-components/file-select-input';
import '@unicef-polymer/etools-unicef/src/etools-upload/etools-upload';
import {EditAttachmentsPopupComponent} from './edit-attachments-popup';
import {html, TemplateResult} from 'lit';
import {translate} from 'lit-translate';
import {InputStyles} from '../../../styles/input-styles';
import {DialogStyles} from '../../../styles/dialog-styles';
import {ATTACHMENTS_STORE} from '../../../../endpoints/endpoints-list';
import {getEndpoint} from '../../../../endpoints/endpoints';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

export function template(this: EditAttachmentsPopupComponent): TemplateResult {
  // language=HTML
  return html`
    ${InputStyles} ${DialogStyles}

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
      .cancelBtnText="${translate('CANCEL')}"
      ?disable-confirm-btn="${this.uploadInProgress}"
      ?disable-dismiss-btn="${this.uploadInProgress}"
    >
      <etools-loading
        ?active="${this.savingInProcess}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="container layout-vertical">
        <etools-dropdown
          class="validate-input flex-1"
          .selected="${this.editedData.file_type}"
          @etools-selected-item-changed="${({detail}: CustomEvent) =>
            this.switchFileType(detail.selectedItem && detail.selectedItem.id)}"
          trigger-value-change-event
          label="${translate('ATTACHMENTS_LIST.FILE_TYPE_LABEL')}"
          placeholder="${translate('ATTACHMENTS_LIST.FILE_TYPE_PLACEHOLDER')}"
          required
          hide-search
          .options="${this.attachmentTypes}"
          option-label="label"
          option-value="id"
          ?invalid="${this.errors && this.errors.file_type}"
          .errorMessage="${this.errors && this.errors.file_type}"
          @focus="${() => this.resetFieldError('file_type')}"
          @click="${() => this.resetFieldError('file_type')}"
          allow-outside-scroll
          dynamic-align
        ></etools-dropdown>
        <div class="file-upload-container">
          <etools-upload
            .uploadBtnLabel="${translate('UPLOAD_FILE')}"
            .readonly="${this.editedData && this.editedData.file}"
            .fileUrl="${this.editedData && this.editedData.file}"
            .uploadEndpoint="${getEndpoint(ATTACHMENTS_STORE).url}"
            @upload-finished="${(event: CustomEvent) => this.fileSelected(event.detail)}"
            @upload-started="${() => (this.uploadInProgress = true)}"
            @delete-file="${() => {
              this.selectedFileId = null;
            }}"
          ></etools-upload>
        </div>
      </div>
    </etools-dialog>
  `;
}
