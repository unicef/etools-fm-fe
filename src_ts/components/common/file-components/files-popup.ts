import {css, CSSResult, html, LitElement, TemplateResult} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {InputStyles} from '../../styles/input-styles';
import {DialogStyles} from '../../styles/dialog-styles';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {fireEvent} from '@unicef-polymer/etools-utils/dist/fire-event.util';
import {repeat} from 'lit/directives/repeat.js';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';
import '@unicef-polymer/etools-unicef/src/etools-upload/etools-upload';

@customElement('files-popup')
export class FilesPopup extends LitElement {
  @property() dialogOpened = true;
  @property() attachments: IAttachment[] = [];

  set dialogData(attachments: IAttachment[]) {
    this.attachments = attachments;
  }

  render(): TemplateResult {
    return html`
      ${InputStyles} ${DialogStyles}
      <etools-dialog
        id="dialog"
        size="md"
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        hide-confirm-btn
        .cancelBtnText="${translate('CANCEL')}"
        dialog-title="${translate('ATTACHMENTS_LIST.TITLE')}"
        @close="${this.onClose}"
      >
        <div class="layout-vertical files">
          ${repeat(
            this.attachments,
            (attachment: IAttachment) => html`
              <etools-upload
                .uploadBtnLabel="${translate('UPLOAD_FILE')}"
                readonly
                .fileUrl="${attachment.file}"
              ></etools-upload>
            `
          )}
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'dialog-closed', {confirmed: false});
  }

  static get styles(): CSSResult {
    // language=CSS
    return css`
      .files {
        padding: 0 25px;
      }
    `;
  }
}
