import {html, TemplateResult} from 'lit-html';
import {InputStyles} from '../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../styles/dialog-styles';
import {getEndpoint} from '../../../../../../endpoints/endpoints';
import {ATTACHMENTS_STORE} from '../../../../../../endpoints/endpoints-list';
import '@unicef-polymer/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-loading';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@polymer/paper-button/paper-button';
import '@polymer/iron-icons/iron-icons';
import {translate} from 'lit-translate';
import {SummaryChecklistAttachmentsPopup} from './summary-checklist-attachments-popup';

export function template(this: SummaryChecklistAttachmentsPopup): TemplateResult {
  return html`
    ${InputStyles} ${DialogStyles}

    <etools-dialog
      id="dialog"
      size="md"
      no-padding
      keep-dialog-open
      ?opened="${this.dialogOpened}"
      .okBtnText="${translate('MAIN.BUTTONS.SAVE')}"
      .hideConfirmBtn="${this.readonly}"
      dialog-title="${this.popupTitle}"
      @close="${this.onClose}"
      @confirm-btn-clicked="${() => this.saveChanges()}"
    >
      <a id="link" target="_blank" hidden></a>

      <!--    Spinner    -->
      <etools-loading
        ?active="${this.savingInProcess}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      ></etools-loading>

      <div class="content">
        ${this.attachments
          .filter((attachment: IEditedAttachment | StoredAttachment) => !attachment.hasOwnProperty('delete'))
          .map(
            (attachment: StoredAttachment | IAttachment, index: number) => html`
              <div class="file-selector-container with-type-dropdown">
                <!--        Type select Dropdown        -->
                <etools-dropdown
                  class="type-dropdown disabled-as-readonly"
                  .selected="${attachment.file_type}"
                  @etools-selected-item-changed="${({detail}: CustomEvent) =>
                    this.changeFileType(attachment, detail.selectedItem)}"
                  trigger-value-change-event
                  label="${translate('ATTACHMENTS_LIST.FILE_TYPE_LABEL')}"
                  placeholder="${translate('ATTACHMENTS_LIST.FILE_TYPE_PLACEHOLDER')}"
                  required
                  ?readonly="${this.readonly}"
                  ?disabled="${this.readonly}"
                  hide-search
                  .options="${this.attachmentTypes}"
                  option-label="label"
                  option-value="id"
                  ?invalid="${!attachment.file_type && this.saveBtnClicked}"
                  .errorMessage="File Type is required"
                  allow-outside-scroll
                  dynamic-align
                ></etools-dropdown>

                <!--        File name component          -->
                <div class="filename-container">
                  <iron-icon class="file-icon" icon="attachment"></iron-icon>
                  <span class="filename" title="${attachment.filename}">${attachment.filename}</span>
                </div>

                <!--         Download Button         -->
                <paper-button class="download-button" @tap="${() => this.downloadFile(attachment)}">
                  <iron-icon icon="cloud-download" class="dw-icon"></iron-icon>
                  Download
                </paper-button>

                <!--        Delete Button          -->
                <paper-button
                  class="delete-button"
                  ?hidden="${this.readonly}"
                  @tap="${() => this.deleteAttachment(index)}"
                >
                  Delete
                </paper-button>
              </div>
            `
          )}

        <!--     Upload button     -->
        <etools-upload-multi
          class="with-padding"
          ?hidden="${this.readonly}"
          @upload-finished="${({detail}: CustomEvent) => this.attachmentsUploaded(detail)}"
          .endpointInfo="${{endpoint: getEndpoint(ATTACHMENTS_STORE).url}}"
        ></etools-upload-multi>
      </div>
    </etools-dialog>
  `;
}
