import {LitElement, TemplateResult, html, property, customElement, CSSResult, css} from 'lit-element';
import {InputStyles} from '../../styles/input-styles';
import {DialogStyles} from '../../styles/dialog-styles';
import {translate} from 'lit-translate';
import {fireEvent} from '../../utils/fire-custom-event';
import {repeat} from 'lit-html/directives/repeat';
import '@unicef-polymer/etools-upload/etools-upload';

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
      <style>
        etools-upload {
          --paper-input-container: {
            padding: 0;
          }
        }
      </style>
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
        <div class="layout vertical files">
          ${repeat(
            this.attachments,
            (attachment: IAttachment) => html`
              <etools-upload readonly .fileUrl="${attachment.file}"></etools-upload>
            `
          )}
        </div>
      </etools-dialog>
    `;
  }

  onClose(): void {
    fireEvent(this, 'response', {confirmed: false});
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
