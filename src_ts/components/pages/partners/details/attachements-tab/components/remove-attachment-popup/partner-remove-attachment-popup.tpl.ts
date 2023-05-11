import {PartnerRemoveAttachmentPopupComponent} from './partner-remove-attachment-popup';
import {html, TemplateResult} from 'lit-element';
import {translate} from 'lit-translate';
import {InputStyles} from '../../../../../../styles/input-styles';
import {DialogStyles} from '../../../../../../styles/dialog-styles';

export function template(this: PartnerRemoveAttachmentPopupComponent): TemplateResult {
  // language=HTML
  return html`
    ${InputStyles} ${DialogStyles}
    <etools-dialog
      size="md"
      no-padding
      keep-dialog-open
      theme="confirmation"
      ?opened="${this.dialogOpened}"
      ok-btn-text="${translate('MAIN.BUTTONS.DELETE')}"
      .cancelBtnText="${translate('CANCEL')}"
      @confirm-btn-clicked="${() => this.processRequest()}"
      @close="${this.onClose}"
    >
      <etools-loading
        ?active="${this.removeInProcess}"
        loading-text="${translate('MAIN.SAVING_DATA_IN_PROCESS')}"
      ></etools-loading>
      <div class="container layout horizontal">
        <div>${translate('ATTACHMENTS_LIST.DELETE_POPUP_TITLE')}</div>
      </div>
    </etools-dialog>
  `;
}
