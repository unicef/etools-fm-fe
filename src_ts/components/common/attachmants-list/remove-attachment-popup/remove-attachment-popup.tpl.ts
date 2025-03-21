import {RemoveAttachmentPopupComponent} from './remove-attachment-popup';
import {html, TemplateResult} from 'lit';
import {translate} from '@unicef-polymer/etools-unicef/src/etools-translate';
import {InputStyles} from '../../../styles/input-styles';
import {DialogStyles} from '../../../styles/dialog-styles';
import '@unicef-polymer/etools-unicef/src/etools-dialog/etools-dialog.js';

export function template(this: RemoveAttachmentPopupComponent): TemplateResult {
  // language=HTML
  return html`
    ${InputStyles} ${DialogStyles}
    <etools-dialog
      size="md"
      keep-dialog-open
      theme="confirmation"
      confirmBtnVariant="danger"
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
      <div class="container-dialog layout-horizontal">
        <div>${translate('ATTACHMENTS_LIST.DELETE_POPUP_TITLE')}</div>
      </div>
    </etools-dialog>
  `;
}
