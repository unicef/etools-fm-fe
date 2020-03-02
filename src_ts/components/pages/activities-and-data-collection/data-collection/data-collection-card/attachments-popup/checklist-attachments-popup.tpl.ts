import {ChecklistAttachmentsPopup} from './checklist-attachments-popup';
import {html, TemplateResult} from 'lit-html';
import {InputStyles} from '../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../styles/dialog-styles';
import {getEndpoint} from '../../../../../../endpoints/endpoints';
import {ATTACHMENTS_STORE} from '../../../../../../endpoints/endpoints-list';
import '@unicef-polymer/etools-upload/etools-upload-multi';
import '@unicef-polymer/etools-dialog/etools-dialog';
import '@unicef-polymer/etools-loading';
import '@unicef-polymer/etools-dropdown/etools-dropdown';
import '@polymer/paper-button/paper-button';
import '@polymer/iron-icons/iron-icons';
import {translate} from 'lit-translate';

export function template(this: ChecklistAttachmentsPopup): TemplateResult {
  return html`
    ${InputStyles} ${DialogStyles}
    <style>
      etools-dialog {
        --etools-dialog-primary-color: var(--module-primary);
        --etools-dialog-scrollable: {
          margin-top: 0;
          padding-top: 12px !important;
        }
        --etools-dialog-content: {
          min-height: 80px;
          padding-bottom: 8px !important;
          padding-top: 0px !important;
        }
        --etools-dialog-button-styles: {
          margin-top: 0;
        }
        --etools-dialog-title: {
          padding: 8px 45px 8px 24px;
        }
      }
    </style>
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

      <div>
        ${this.attachments.map(
          (attachment: GenericObject, index: number) => html`
            <div class="file-selector-container with-type-dropdown">
              <!--        Type select Dropdown        -->
              <etools-dropdown
                class="type-dropdown disabled-as-readonly file-selector__type-dropdown"
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
                .options="${this.metadata.options.target_attachments_file_types.values}"
                option-label="label"
                option-value="value"
                ?invalid="${!attachment.file_type && this.saveBtnClicked}"
                .errorMessage="File Type is required"
                allow-outside-scroll
                dynamic-align
              ></etools-dropdown>

              <!--        File name component          -->
              <div class="filename-container file-selector__filename">
                <iron-icon class="file-icon" icon="attachment"></iron-icon>
                <span class="filename" title="${attachment.filename}">${attachment.filename}</span>
              </div>

              <!--         Download Button         -->
              <paper-button
                class="download-button file-selector__download"
                @tap="${() => this.downloadFile(attachment)}"
              >
                <iron-icon icon="cloud-download" class="dw-icon"></iron-icon>
                Download
              </paper-button>

              <!--        Delete Button          -->
              <paper-button
                class="delete-button file-selector__delete"
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
