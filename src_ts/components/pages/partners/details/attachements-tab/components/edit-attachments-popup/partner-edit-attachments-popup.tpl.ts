import '@unicef-polymer/etools-unicef/src/etools-upload/etools-upload';
import {PartnerEditAttachmentsPopupComponent} from './partner-edit-attachments-popup';
import {html, TemplateResult} from 'lit';
import {translate} from 'lit-translate';
import {InputStyles} from '../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../styles/dialog-styles';
import {resetError} from '../../../../../../utils/utils';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

export function template(this: PartnerEditAttachmentsPopupComponent): TemplateResult {
  // language=HTML
  return html`
    ${InputStyles} ${DialogStyles}

    <etools-dialog
      size="md"
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      dialog-title="${translate(
        this.editedData.id ? 'ATTACHMENTS_LIST.EDIT_POPUP_TITLE' : 'TPM_DETAILS.ATTACH_FILE_FOR_VISIT'
      )}"
      @confirm-btn-clicked="${() => this.processRequest()}"
      @close="${this.onClose}"
      .okBtnText="${translate(this.editedData.id ? 'MAIN.BUTTONS.SAVE' : 'MAIN.BUTTONS.ADD')}"
      .cancelBtnText="${translate('CANCEL')}"
      ?show-spinner="${this.savingInProcess}"
    >
      <etools-loading
        ?active="${this.savingInProcess}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="container layout vertical">
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
          @focus="${resetError}"
          @click="${resetError}"
          allow-outside-scroll
          dynamic-align
        ></etools-dropdown>
        <div class="file-upload-container">
          <etools-upload
            id="uploadFile"
            .uploadBtnLabel="${translate('UPLOAD_FILE')}"
            .fileUrl="${this.editedData && this.editedData.file}"
            .showChange="${this.editedData && this.editedData.file}"
            .showDeleteBtn="${false}"
            .autoUpload="${false}"
            required
            auto-validation
            @focus="${resetError}"
            @click="${resetError}"
          ></etools-upload>
        </div>
      </div>
    </etools-dialog>
  `;
}
