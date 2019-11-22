import {LitElement, TemplateResult, html, property, customElement} from 'lit-element';
import {InputStyles} from '../../../../styles/input-styles';
import {DialogStyles} from '../../../../styles/dialog-styles';
import {translate} from '../../../../../localization/localisation';
import {fireEvent} from '../../../../utils/fire-custom-event';
import {repeat} from 'lit-html/directives/repeat';

@customElement('files-popup')
export class FilesPopup extends LitElement {
  @property() dialogOpened: boolean = true;
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
        no-padding
        keep-dialog-open
        ?opened="${this.dialogOpened}"
        hide-confirm-btn
        dialog-title="${translate('ATTACHMENTS_LIST.TITLE')}"
        @close="${this.onClose}"
      >
        <div class="layout vertical">
          ${repeat(
            this.attachments,
            (attachment: IAttachment) => html`
              <file-select-input
                .fileId="${attachment.id}"
                .fileName="${attachment.filename}"
                .fileData="${attachment.file}"
                ?isReadonly="${true}"
              ></file-select-input>
            `
          )}
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
  }
}
